#import <CommonCrypto/CommonDigest.h>
#import <CoreImage/CoreImage.h>
#import <Foundation/Foundation.h>
#import <ImageIO/ImageIO.h>
#import <Vision/Vision.h>

static NSString *SHA256Hex(NSData *data) {
    unsigned char digest[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(data.bytes, (CC_LONG)data.length, digest);
    NSMutableString *hex = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
    for (NSInteger index = 0; index < CC_SHA256_DIGEST_LENGTH; index += 1) {
        [hex appendFormat:@"%02x", digest[index]];
    }
    return hex;
}

static NSString *DecodeQR(NSURL *fileURL, NSString *identifier, NSError **error) {
    CGImageSourceRef source = CGImageSourceCreateWithURL((__bridge CFURLRef)fileURL, NULL);
    if (source == NULL) {
        if (error != NULL) {
            *error = [NSError errorWithDomain:@"mdkg.qr" code:1 userInfo:@{
                NSLocalizedDescriptionKey: [NSString stringWithFormat:@"could not read QR image for %@", identifier]
            }];
        }
        return nil;
    }
    CGImageRef image = CGImageSourceCreateImageAtIndex(source, 0, NULL);
    CFRelease(source);
    if (image == NULL) {
        if (error != NULL) {
            *error = [NSError errorWithDomain:@"mdkg.qr" code:2 userInfo:@{
                NSLocalizedDescriptionKey: [NSString stringWithFormat:@"could not decode QR image bytes for %@", identifier]
            }];
        }
        return nil;
    }

    VNDetectBarcodesRequest *request = [[VNDetectBarcodesRequest alloc] init];
    request.symbologies = @[VNBarcodeSymbologyQR];
    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:image options:@{}];
    NSError *visionError = nil;
    BOOL performed = [handler performRequests:@[request] error:&visionError];
    NSString *decoded = nil;
    if (performed && visionError == nil && request.results.count > 0) {
        VNBarcodeObservation *observation = request.results.firstObject;
        decoded = observation.payloadStringValue;
    }
    if (decoded == nil) {
        CIImage *ciImage = [CIImage imageWithCGImage:image];
        CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode
                                                 context:nil
                                                 options:@{CIDetectorAccuracy: CIDetectorAccuracyHigh}];
        NSArray<CIFeature *> *features = [detector featuresInImage:ciImage];
        for (CIFeature *feature in features) {
            if ([feature isKindOfClass:[CIQRCodeFeature class]]) {
                decoded = ((CIQRCodeFeature *)feature).messageString;
                if (decoded != nil) {
                    break;
                }
            }
        }
    }
    CGImageRelease(image);
    if (decoded == nil) {
        if (error != NULL) {
            *error = visionError ?: [NSError errorWithDomain:@"mdkg.qr" code:3 userInfo:@{
                NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Vision and CIDetector could not scan QR image for %@", identifier]
            }];
        }
        return nil;
    }
    return decoded;
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc != 2) {
            fprintf(stderr, "usage: scan-qr <asset-directory>\n");
            return 2;
        }

        NSString *assetPath = [NSString stringWithUTF8String:argv[1]];
        NSURL *assetDirectory = [NSURL fileURLWithPath:assetPath isDirectory:YES];
        NSArray<NSDictionary *> *definitions = @[
            @{
                @"id": @"quickstart",
                @"filename": @"quickstart.png",
                @"url": @"https://docs.mdkg.dev/start-here/quickstart/"
            },
            @{
                @"id": @"issues",
                @"filename": @"issues.png",
                @"url": @"https://github.com/nickreames/mdkg/issues"
            },
        ];
        NSMutableArray<NSDictionary *> *items = [NSMutableArray array];

        for (NSDictionary *definition in definitions) {
            NSString *identifier = definition[@"id"];
            NSString *payload = definition[@"url"];
            NSURL *fileURL = [assetDirectory URLByAppendingPathComponent:definition[@"filename"]];
            NSError *error = nil;
            NSData *data = [NSData dataWithContentsOfURL:fileURL options:0 error:&error];
            if (data == nil || error != nil) {
                fprintf(stderr, "scan-qr: %s\n", error.localizedDescription.UTF8String);
                return 1;
            }

            NSString *decoded = DecodeQR(fileURL, identifier, &error);
            if (decoded == nil || error != nil || ![decoded isEqualToString:payload]) {
                fprintf(
                    stderr,
                    "scan-qr: mismatch for %s; expected %s, got %s\n",
                    identifier.UTF8String,
                    payload.UTF8String,
                    decoded.UTF8String ?: "(null)"
                );
                return 1;
            }

            CGImageSourceRef source = CGImageSourceCreateWithURL((__bridge CFURLRef)fileURL, NULL);
            CGImageRef image = CGImageSourceCreateImageAtIndex(source, 0, NULL);
            size_t width = CGImageGetWidth(image);
            size_t height = CGImageGetHeight(image);
            CGImageRelease(image);
            CFRelease(source);

            [items addObject:@{
                @"id": identifier,
                @"path": fileURL.path,
                @"displayed_url": payload,
                @"decoded_payload": decoded,
                @"scan_passed": @YES,
                @"width": @(width),
                @"height": @(height),
                @"sha256": SHA256Hex(data),
            }];
        }

        NSDictionary *receipt = @{
            @"schema_version": @1,
            @"generated_at": @"deterministic-local-build",
            @"generator": @"ReportLab QrCodeWidget",
            @"scanner": @"Vision VNDetectBarcodesRequest",
            @"items": items,
        };
        NSError *error = nil;
        NSData *receiptData = [NSJSONSerialization dataWithJSONObject:receipt
                                                              options:NSJSONWritingPrettyPrinted | NSJSONWritingSortedKeys | NSJSONWritingWithoutEscapingSlashes
                                                                error:&error];
        if (receiptData == nil || error != nil) {
            fprintf(stderr, "scan-qr: %s\n", error.localizedDescription.UTF8String);
            return 1;
        }
        NSURL *receiptURL = [assetDirectory URLByAppendingPathComponent:@"scan-receipt.json"];
        if (![receiptData writeToURL:receiptURL options:NSDataWritingAtomic error:&error]) {
            fprintf(stderr, "scan-qr: %s\n", error.localizedDescription.UTF8String);
            return 1;
        }
    }
    return 0;
}

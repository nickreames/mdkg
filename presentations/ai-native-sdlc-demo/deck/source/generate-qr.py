from pathlib import Path
import sys

from reportlab.graphics import renderSVG
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.lib import colors


DEFINITIONS = (
    (
        "quickstart.svg",
        "https://docs.mdkg.dev/start-here/quickstart/",
    ),
    (
        "issues.svg",
        "https://github.com/nickreames/mdkg/issues",
    ),
)


def generate_qr(payload: str, output_path: Path) -> None:
    widget = qr.QrCodeWidget(payload, barLevel="Q")
    widget.qr.make()
    module_size = 12
    quiet_zone = module_size * 4
    symbol_size = widget.qr.getModuleCount() * module_size
    size = symbol_size + quiet_zone * 2
    widget.barFillColor = colors.black
    widget.barWidth = symbol_size
    widget.barHeight = symbol_size
    widget.x = quiet_zone
    widget.y = quiet_zone

    drawing = Drawing(size, size)
    drawing.add(
        Rect(
            0,
            0,
            size,
            size,
            fillColor=colors.white,
            strokeColor=None,
        )
    )
    drawing.add(widget)
    renderSVG.drawToFile(drawing, str(output_path))


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: generate-qr.py <output-directory>", file=sys.stderr)
        return 2

    output_directory = Path(sys.argv[1])
    output_directory.mkdir(parents=True, exist_ok=True)
    for filename, payload in DEFINITIONS:
        generate_qr(payload, output_directory / filename)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

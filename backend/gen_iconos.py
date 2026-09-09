"""Crea iconos verdes para la app. Explica: hace dos fotos simples para instalar en celular."""
import struct, zlib, os
d = os.path.join(os.path.dirname(__file__), '..', 'frontend')
d = os.path.abspath(d)

def png(path, size, color):
    """Guarda un cuadrado de color como PNG."""
    w = h = size
    raw = b''.join(b'\x00' + bytes(color) * w for _ in range(h))
    comp = zlib.compress(raw)

    def chunk(tipo, datos):
        c = tipo + datos
        return struct.pack('>I', len(datos)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)))
        f.write(chunk(b'IDAT', comp))
        f.write(chunk(b'IEND', b''))

png(os.path.join(d, 'icon-192.png'), 192, (11, 61, 46))
png(os.path.join(d, 'icon-512.png'), 512, (11, 61, 46))
print('ICONOS_OK')

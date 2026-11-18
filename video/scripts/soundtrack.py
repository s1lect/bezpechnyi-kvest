"""
Синтезований саундтрек для промовідео: м'який пед, легке арпеджіо й звуки подій
(«вжух» на переходах, дзвіночки на знайдених небезпеках). Жодних сторонніх семплів —
усе згенеровано кодом, тож проблем з авторськими правами немає.
Запуск: python3 scripts/soundtrack.py  →  public/soundtrack.wav
"""
import wave
import numpy as np

SR = 44100
FPS = 30
TOTAL_FRAMES = 1209
DUR = TOTAL_FRAMES / FPS
N = int(DUR * SR)
t = np.arange(N) / SR
mix = np.zeros(N)
rng = np.random.default_rng(7)

def note(f):  # MIDI → Гц
    return 440 * 2 ** ((f - 69) / 12)

def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A)
    e[A:A + D] = np.linspace(1, s, D)
    e[-R:] *= np.linspace(1, 0, R)
    return e

def add(signal, start_s):
    i = int(start_s * SR)
    j = min(N, i + len(signal))
    if i < N:
        mix[i:j] += signal[: j - i]

def lowpass(x, k=0.08):
    y = np.zeros_like(x)
    acc = 0.0
    for n in range(len(x)):
        acc += k * (x[n] - acc)
        y[n] = acc
    return y

# ---- пед: акорди по 4 секунди (I–vi–IV–V у ля-бемоль мажорі, тепло й спокійно) ----
BPM = 96
beat = 60 / BPM
chords = [[56, 60, 63, 68], [53, 56, 60, 65], [49, 53, 56, 61], [51, 55, 58, 63]]
bar = beat * 4
for k in range(int(DUR / bar) + 1):
    ch = chords[k % 4]
    n = int(bar * 1.15 * SR)
    tt = np.arange(n) / SR
    e = env_adsr(n, 0.9, 0.5, 0.75, 1.2)
    sig = np.zeros(n)
    for m in ch:
        f = note(m)
        sig += np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2 * tt + 0.3) + 0.12 * np.sin(2 * np.pi * f * 3 * tt)
    add(0.05 * sig * e, k * bar)

# ---- арпеджіо восьмими з другого такту, тихо ----
for k in range(int(DUR / (beat / 2))):
    start = k * beat / 2
    if start < bar * 1.5 or start > DUR - 2:
        continue
    ch = chords[int(start / bar) % 4]
    m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12
    n = int(0.6 * SR)
    tt = np.arange(n) / SR
    e = np.exp(-tt * 7)
    f = note(m)
    add(0.045 * (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt)) * e, start)

# ---- м'який пульс на долі ----
for k in range(int(DUR / beat)):
    start = k * beat
    if start < bar * 2 or start > DUR - 2.5:
        continue
    n = int(0.25 * SR)
    tt = np.arange(n) / SR
    f = 55 * np.exp(-tt * 18) + 45
    add(0.12 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14), start)

# ---- звуки подій ----
def whoosh(at_frame):
    n = int(0.7 * SR)
    noise = rng.standard_normal(n)
    noise = lowpass(noise, 0.12)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    add(0.35 * noise * e, at_frame / FPS - 0.2)

def chime(at_frame, base=84, vol=0.08):
    n = int(1.2 * SR)
    tt = np.arange(n) / SR
    sig = np.zeros(n)
    for m, a in [(base, 1), (base + 7, 0.5), (base + 12, 0.35)]:
        sig += a * np.sin(2 * np.pi * note(m) * tt)
    add(vol * sig * np.exp(-tt * 5), at_frame / FPS)

def pop(at_frame, vol=0.1):
    n = int(0.12 * SR)
    tt = np.arange(n) / SR
    f = 900 * np.exp(-tt * 30) + 300
    add(vol * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 40), at_frame / FPS)

for f in [132, 249, 411, 603, 765, 927, 1044]:
    whoosh(f + 9)
chime(34, 80, 0.1)  # логотип
for i, f in enumerate([40, 62, 84, 106, 128]):  # знайдені небезпеки
    chime(411 + f, 84 + [0, 2, 4, 7, 12][i], 0.07)
for f in [70, 92, 114]:  # підозрілі фрагменти в чаті
    pop(603 + f, 0.12)
chime(765 + 110, 79, 0.1)  # правильна відповідь у класі
chime(765 + 112, 86, 0.06)
for k, m in enumerate([68, 72, 75, 80]):  # фінальний акорд
    chime(1044 + 6 + k * 3, m, 0.07)

# ---- майстеринг ----
fade = int(1.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix = mix / np.max(np.abs(mix)) * 0.7
stereo = np.stack([mix, np.roll(mix, int(0.012 * SR))], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open('public/soundtrack.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f'soundtrack.wav: {DUR:.1f} s')

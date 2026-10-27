// На экранах шире макета (1440px) пропорционально увеличиваем всю страницу через CSS zoom,
// чтобы на 1920/2560 сайт выглядел так же, как в Figma, а не узкой колонкой с обрезанным фоном.
// Leaflet учитывает zoom предка (L.DomUtil.getScale), поэтому клики и перетаскивание на карте остаются точными.
const DESIGN_WIDTH = 1440

function applyScale() {
  const root = document.documentElement
  root.style.zoom = ''
  const width = root.clientWidth // без полосы прокрутки
  if (width > DESIGN_WIDTH) root.style.zoom = String(width / DESIGN_WIDTH)
}

export function enablePageScale() {
  applyScale()
  let frame = 0
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(applyScale)
  })
}

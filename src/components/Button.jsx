import { ArrowDown, ArrowExternal } from './Icons'

const icons = {
  external: ArrowExternal,
  down: ArrowDown,
}

/**
 * Кнопка-«пилюля» из макета: текст слева, круглая иконка справа.
 * variant: yellow | dark | white | muted
 */
export function Button({
  as: Comp = 'button',
  variant = 'dark',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}) {
  const Icon = icon ? icons[icon] : null
  return (
    <Comp
      className={`btn btn-${variant} btn-${size} ${Icon ? 'btn-has-icon' : ''} ${className}`.trim()}
      {...props}
    >
      <span className="btn-label">{children}</span>
      {Icon ? (
        <span className="btn-icon" aria-hidden="true">
          <Icon />
        </span>
      ) : null}
    </Comp>
  )
}

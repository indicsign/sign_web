import './SectionHeading.css'

type Props = {
  id: string
  title: string
  body: string
}

export function SectionHeading({ id, title, body }: Props) {
  return (
    <div className="section-heading">
      <h2 className="section-heading__title" id={id}>
        {title}
      </h2>
      <p className="section-heading__body measure">{body}</p>
    </div>
  )
}

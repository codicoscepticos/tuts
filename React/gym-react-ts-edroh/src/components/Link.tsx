import React from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll'

type Props = {
  id:string;
  name:string;
}

const Link = ({id, name}: Props) => {
  return (
    <AnchorLink
      href={'#' + id}
    >
      {name}
    </AnchorLink>
  )
}

export default Link

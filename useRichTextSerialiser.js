import escapeHtml from "escape-html"
import { Text } from "slate"

export const useRichTextSerialiser = richTextNode => {
  const serialize = node => {
    let nodeText = escapeHtml(node.text)
    if (Text.isText(node)) {
      if (node["bold"]) {
        nodeText = `<strong>` + nodeText + `</strong>`
      }

      if (node["italic"]) {
        nodeText = `<em>` + nodeText + `</em>`
      }

      if (node["underlined"]) {
        nodeText = `<u>` + nodeText + `</u>`
      }

      if (node["code"]) {
        nodeText = `<code>` + nodeText + `</code>`
      }

      return nodeText
    }

    if (Array.isArray(node)) {
      return node.map(subNode => serializeSubNode(subNode)).join("")
    }

    return serializeSubNode(node)
  }

  const serializeSubNode = node => {
    const children = node.children.map(n => serialize(n)).join("")
    switch (node.type) {
      case "link":
        return `<a href="${escapeHtml(node.href)}"
        ${node.newTab ? "target='_blank'" : ""}
        ${node.noFollow ? "rel='nofollow'" : ""}>${children}</a>`
      case "h1":
        return `<h1>${children}</h1>`
      case "h2":
        return `<h2>${children}</h2>`
      case "h3":
        return `<h3>${children}</h3>`
      case "h4":
        return `<h4>${children}</h4>`
      case "h5":
        return `<h5>${children}</h5>`
      case "h6":
        return `<h6>${children}</h6>`
      case "unordered-list":
        return `<ul>${children}</ul>`
      case "ordered-list":
        return `<ol>${children}</ol>`
      case "list-item":
        return `<li >${children}</li>`
      case "description":
        return `<p><b>${children}</b></p>`
      default:
        return `<p>${children}</p>`
    }
  }
  return serialize(richTextNode)
}

'use strict'

// Adapted from https://github.com/markdown-it/markdown-it/blob/fbc6b0fed563ba7c00557ab638fd19752f8e759d/docs/architecture.md

function markdownitLinkTarget (md, config) {
  config = config || {}

  var defaultRender = md.renderer.rules.link_open || this.defaultRender
  var target = config.target || '_blank'
  // v2 TODO: Make the default value noopener
  // https://jakearchibald.com/2016/performance-benefits-of-rel-noopener
  var rel = config.rel

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    attachAttribute(tokens, idx, 'target', target)
    if (rel) {
      attachAttribute(tokens, idx, 'rel', rel)
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}

function attachAttribute (tokens, idx, attributeName, attributeValue) {
  var attributeIndex = tokens[idx].attrIndex(attributeName)

  if (attributeIndex < 0) {
    tokens[idx].attrPush([attributeName, attributeValue]) // add new attribute
  } else {
    tokens[idx].attrs[attributeIndex][1] = attributeValue // replace value of existing attr
  }
}

markdownitLinkTarget.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkTarget

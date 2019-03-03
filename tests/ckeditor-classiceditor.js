/**
 * @license Copyright (c) 2019, LeeHyungGeun . All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { define, render, WeElement } from 'omi'

import '../src/ckeditor' // import CKEditor element of omi
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function getAttributes(node) {
  let attrs = {}
  // console.log(node.attributes)
  Object.keys(node.attributes).forEach(function (item) {
    attrs[node.attributes[item].name] = node.attributes[item].value
  })
  return attrs
}

describe( 'CKEditor Component + ClassicEditor Build', () => {
  let wrapper

  before(() => {
    wrapper = document.createElement('div');
    (document.body || document.documentElement).appendChild(wrapper)
  })

  beforeEach(() => {
    wrapper.innerHTML = ''
  })

  after(() => {
    wrapper.parentNode.removeChild(wrapper)
    wrapper = null
  })

  it( 'should initialize the ClassicEditor properly', done => {
    render(<ckeditor-element editor={ ClassicEditor } />, wrapper)

    setTimeout(() => {

      let node = wrapper.childNodes
      expect( node.editor ).to.not.be.null

      done()
    })
  })
})

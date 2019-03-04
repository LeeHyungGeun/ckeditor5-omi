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
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it( 'should initialize the ClassicEditor properly', done => {
    render(<ckeditor-element editor={ ClassicEditor } />, scratch)

    setTimeout(() => {

      let node = scratch.childNodes
      expect( node.editor ).to.not.be.null

      done()
    })
  })
})

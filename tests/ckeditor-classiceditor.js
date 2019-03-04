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
  let scratch, wrapper

  before(() => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterEach(() => {
    if ( wrapper ) {
      wrapper.uninstall()
    }
  })

  after(() => {
    if (scratch && scratch.parentNode) {
      scratch.parentNode.removeChild(scratch)
    }
    scratch = null
  })

  it( 'should initialize the ClassicEditor properly', done => {
    wrapper = render(<ckeditor-element editor={ ClassicEditor } />, scratch)

    setTimeout(() => {

      let wrapper = scratch.childNodes
      expect( wrapper.editor ).to.not.be.null

      done()
    })
  })
})

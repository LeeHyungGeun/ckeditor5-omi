/**
 * @license Copyright (c) 2019, LeeHyungGeun . All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { render } from 'omi'
import '../src/ckeditor' // CKEditor element of omi

import MockEditor from './_utils/mockeditor'
import { ModelDocument, ViewDocument } from './_utils/mockeditor'


// Mock of data model's document.
const modelDocument = {
	on() {}
};

// Mock of class that representing a basic, generic editor.
class Editor {
	constructor() {
		this.model = {
			document: modelDocument
		}
	}

	destroy() {
		return Promise.resolve();
	}

	// Implements the `DataApi` interface.
	// See: https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_utils_dataapimixin-DataApi.html
	setData() {}
	getData() {}

	static create() {
		return Promise.resolve();
	}
}

describe( 'CKEditor Component', () => {
  let sandbox, wrapper, scratch, vm

  before(() => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch);
  })

  beforeEach(() => {
    scratch.innerHTML = ''
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
    if ( wrapper ) {
      wrapper.uninstall()
    }
  })

  after(() => {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper)
    }
    scratch = null
  })

  it( 'component should have a name', () => {
    let _wrapper = <ckeditor-element />
    expect( _wrapper.nodeName ).to.equal( 'ckeditor-element' )
  })

  it( 'calls editor#create when initializing', done => {
    const stub = sandbox.stub( Editor, 'create' ).resolves( new Editor() )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      sinon.assert.calledOnce( stub )
      done()
    })
  })

  it( 'calls editor#destroy when destroying', done => {

    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'destroy' ).resolves()

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      wrapper.uninstall()
      wrapper = null

      expect( editorInstance.destroy.calledOnce ).to.be.true
      done()
    })
  })

  it( 'passes editor promise rejection error to console.error', done => {
    const error = new Error( 'Something went wrong.' )
    const consoleErrorStub = sandbox.stub( console, 'error' )

    sandbox.stub( Editor, 'create' ).rejects( error )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      consoleErrorStub.restore()
      
      expect( consoleErrorStub.calledOnce ).to.be.true;
			expect( consoleErrorStub.firstCall.args[ 0 ] ).to.equal( error );
      done()
    })
  })

  it( 'sets initial data if was specified', done => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'setData' )

    wrapper = render(<ckeditor-element editor={ Editor } data="Hello CKEditor 5!" />, scratch)

    setTimeout(() => {
      expect( editorInstance.setData.calledOnce ).to.be.true;
			expect( editorInstance.setData.firstCall.args[ 0 ] ).to.equal( 'Hello CKEditor 5!' );

			done();
    })
  })

  it( 'sets editor\'s data if properties have changed and contain the "data" key', done => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'setData' )
    sandbox.stub( editorInstance, 'getData' ).returns( '<p>&nbsp;</p>' )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      wrapper.props.data = '<p>Foo Bar.</p>'
      wrapper.update()

      expect( editorInstance.setData.calledOnce ).to.be.true
      expect( editorInstance.setData.firstCall.args[0] ).to.equal( '<p>Foo Bar.</p>' );

      done()
    })
  })

  it( 'does not update the editor\'s data if value under "data" key is equal to editor\'s data', done => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'setData' )
    sandbox.stub( editorInstance, 'getData' ).returns( '<p>Foo Bar.</p>' )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      wrapper.props.data = '<p>Foo Bar.</p>'
      wrapper.update()

      expect( editorInstance.setData.calledOnce ).to.be.false

      done()
    })
  })
})
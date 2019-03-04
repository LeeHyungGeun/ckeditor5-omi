/**
 * @license Copyright (c) 2019, LeeHyungGeun . All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { render } from 'omi'
import '../src/ckeditor' // CKEditor element of omi

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
  let sandbox, wrapper, scratch

  before(() => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch);
  })

  beforeEach(() => {
    scratch.innerHTML = ''
    sandbox = sinon.createSandbox()
    sandbox.stub( modelDocument, 'on' )
  })

  afterEach(() => {
    sandbox.restore()
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

  it( 'does not set editor\'s data if the editor is not ready', () => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'setData' )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    wrapper.updated( { data: 'Foo' } )

    expect( wrapper.editor ).to.be.null
    expect( editorInstance.setData.called ).to.be.false
  })

  it( 'calls "onInit" callback if specified when the editor is ready to use', done => {
    const editorInstance = new Editor()
    const onInit = sandbox.spy()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )

    wrapper = render(<ckeditor-element editor={ Editor } onInit={ onInit } />, scratch)

    setTimeout(() => {
      expect( onInit.calledOnce ).to.be.true
      expect( onInit.firstCall.args[ 0 ] ).to.equal( editorInstance )

      done()
    })
  })

  it( 'listens to the editor\'s changes in order to call "onChange" callback', done => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
		sandbox.stub( editorInstance, 'getData' ).returns( '<p>Foo.</p>' )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      expect( modelDocument.on.calledOnce ).to.be.true
      expect( modelDocument.on.firstCall.args[ 0 ] ).to.equal( 'change:data' )
      expect( modelDocument.on.firstCall.args[ 1 ] ).to.be.a( 'function' )
      
      done()
    })
  })

  it( 'executes "onChange" callback if specified and editor has changed', done => {
    const onChange = sandbox.spy()
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )

    wrapper = render(<ckeditor-element editor={ Editor } onChange={ onChange } />, scratch)

    setTimeout(() => {
      const firstChanges = modelDocument.on.firstCall.args[ 1 ]
      const event = { name: 'change:data' }

      firstChanges( event )

      expect( onChange.calledOnce ).to.equal( true )
      expect( onChange.firstCall.args[ 0 ] ).to.equal( event )
      expect( onChange.firstCall.args[ 1 ] ).to.equal( editorInstance )

      done()
    })
  })

  it( 'executes "onChange" callback if it is available in runtime when the editor\'s data has changed', done => {
    const onChange = sandbox.spy()
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      wrapper.props.onChange = onChange

      const firstChanges = modelDocument.on.firstCall.args[ 1 ]
      const event = { name: 'change:data' }

      firstChanges( event )

      expect( onChange.calledOnce ).to.equal( true )
      expect( onChange.firstCall.args[ 0 ] ).to.equal( event )
      expect( onChange.firstCall.args[ 1 ] ).to.equal( editorInstance )

      done()
    })
  })

  it( 'displays an error if something went wrong', done => {
    const error = new Error( 'Soemthing went wrong.' )
    const consoleErrorStub = sandbox.stub( console, 'error' )

    sandbox.stub( Editor, 'create' ).rejects( error )

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      consoleErrorStub.restore()

      expect( consoleErrorStub.calledOnce ).to.be.true
      expect( consoleErrorStub.firstCall.args[ 0 ] ).to.equal( error )

      done()
    })
  })

  it( 'should call "Editor#destroy()" method during unmounting the component', done => {
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

  it( 'should set to "null" the "editor" property inside the component', done => {
    const editorInstance = new Editor()

    sandbox.stub( Editor, 'create' ).resolves( editorInstance )
    sandbox.stub( editorInstance, 'destroy' ).resolves()

    wrapper = render(<ckeditor-element editor={ Editor } />, scratch)

    setTimeout(() => {
      expect( wrapper.editor ).is.not.null

      wrapper.uninstall()
      // this should be comment here unlike ckeditor-react
      // since it will check editor is null below.
      // wrapper = null

      setTimeout(() => {
        expect( wrapper.editor ).is.null

        done()
      })
    })
  })
})
/**
 * @license Copyright (c) 2019, LeeHyungGeun. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { define, WeElement } from 'omi'

define('ckeditor-element', class extends WeElement {
  install( props ) {
  // After mounting the editor, the variable will contain a reference to the created editor.
  // @see: https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html
    this.editor = null
  }

  updated() {
    if ( this.editor && this.editor.getData() !== this.props.data ) {
      this.editor.setData( this.props.data )
    }
  }

  // Initialize the editor when the component ismounted.
  installed() {
  this._initializeEditor()
  }

  // Destory the editor before unmounting the component.
  /** This shoud be using willBeUninstalled if omi has */
  uninstall() {
    this._destroyEditor()
  }

  // Render a <div> element which will be replaced by CKEditor.
  render() {
    return (
      <div rel={ ref => ( this.domContainer = ref ) }></div>
    )
  }

  _initializeEditor() {
    this.props.editor
    .create( this.base, this.props.config )
    .then( editor => {
      this.editor = editor

      if ( this.props.data ) {
        this.editor.setData( this.props.data )
      }

      if ( this.props.onInit ) {
        this.props.onInit( this.editor )
      }

      const document = this.editor.model.document

      document.on( 'change:data', event => {
        /* istanbul ignore else */
        if ( this.props.onChange ) {
          this.props.onChange( event, editor )
        }
      } )
    } )
    .catch( error => {
      console.error( error )
    })
  }

  _destroyEditor() {
    if ( this.editor ) {
      this.editor.destroy()
      .then( () => {
        this.editor = null
      } )
    }
  }
})

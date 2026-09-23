/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	/*config.toolbar = [
	                  [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates','Maximize', '-', 'ShowBlocks' ],
	                  [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ],
	                  [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ],
	                  [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv' ],
	                  [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ],
	                  [ 'Link', 'Unlink', 'Anchor' ],
	                  [ 'Image', 'Table', 'HorizontalRule' ],
	                  [ 'Format', 'Font', 'FontSize', 'TextColor', 'BGColor' ]
	              ];*/
	config.height = '400px';
	config.toolbar = [	                  
	                  // block 1
	                  [
	                   'Source', '-', 'Preview', '-', 'Templates','Maximize', '-', 'ShowBlocks',
	                   'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'
	                  ],
	                  //block 2
	                  [
					   //'Image', 
					   'Table', 'HorizontalRule', 'Link', 'Unlink', 'Anchor', '-',
	                   'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'
	                   ],
	                  //block 3
	                  [
	                   'Format', 'Font', 'FontSize', 'TextColor', 'BGColor', '-',
	                   'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', '-',
	                   'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'
	                   ]
	                 ];
	//kcfinder module
	config.filebrowserBrowseUrl = '/assets/kcfinder/browse.php?opener=ckeditor&type=files';
	config.filebrowserImageBrowseUrl = '/assets/kcfinder/browse.php?opener=ckeditor&type=images';
	config.filebrowserFlashBrowseUrl = '/assets/kcfinder/browse.php?opener=ckeditor&type=flash';
	config.filebrowserUploadUrl = '/assets/kcfinder/upload.php?opener=ckeditor&type=files';
	config.filebrowserImageUploadUrl = '/assets/kcfinder/upload.php?opener=ckeditor&type=images';
	config.filebrowserFlashUploadUrl = '/assets/kcfinder/upload.php?opener=ckeditor&type=flash';
};

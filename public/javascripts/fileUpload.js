
//import * as FilePond from 'filepond';
// // Import the plugin code
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FilePondPluginImageResize from 'filepond-plugin-image-resize';
// import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

//const FilePond = require('filepond')
// const FilePondPluginImagePreview  = require('filepond-plugin-image-preview')
// const FilePondPluginImageResize = require('filepond-plugin-image-resize')
// const FilePondPluginFileEncode = require('filepond-plugin-file-encode')


FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)


FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})
FilePond.parse(document.body);
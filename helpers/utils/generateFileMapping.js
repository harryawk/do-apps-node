const generateFileMapping = (files, fileAttributes) => {
  if (typeof files === 'undefined') return {};
  if (files.length === 0) return {};
  
  let filesMapping = {};
  for (let file of files) {
    file.fieldname = (file.fieldname).split('[]')[0];
    if (fileAttributes.indexOf(file.fieldname) === -1) continue;
    if (file.fieldname in filesMapping) {
      // fall through
    } else {
      filesMapping[file.fieldname] = [];
    }

    (filesMapping[file.fieldname]).push(file);
  }
  return filesMapping;
}

module.exports = {
  generateFileMapping,
}
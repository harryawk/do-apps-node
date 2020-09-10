const generateFileDict = (body, fileAttributes) => {
  let fileDict = {};
  
  for (let attr in body) {
    let insideDeleted = false;
    if (attr.indexOf('_deleted') !== -1) {
      insideDeleted = true;
      
      let attrName = attr.split('_deleted')[0];
      if (fileAttributes.indexOf(attrName) === -1) continue;
      if (attrName !== '') {
        if (attrName in fileDict) {
          fileDict[attrName]['deleted'] = body[attr];
        } else {
          fileDict[attrName] = {};
          fileDict[attrName]['deleted'] = body[attr];
        }
      }
      
    }
    
    if (attr.indexOf('_current') !== -1) {
      if (insideDeleted) continue;
      
      let attrName = attr.split('_current')[0];
      if (fileAttributes.indexOf(attrName) === -1) continue;
      if (attrName !== '') {
        if (attrName in fileDict) {
          fileDict[attrName]['current'] = body[attr];
        } else {
          fileDict[attrName] = {};
          fileDict[attrName]['current'] = body[attr];
        }
      }

    }
    
  }

  return fileDict;
}

module.exports = {
  generateFileDict,
}
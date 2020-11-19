const crypto = require('crypto')

 function EncryptDecrpytPassword () {
  this.keyStr = 'My*W0#kp@pp%!'
  this.algorithm = 'aes-256-cfb'
  this.hash = crypto.createHash('sha256')
  this.hash.update(this.keyStr)
  this.keyBytes = this.hash.digest()
}

EncryptDecrpytPassword.prototype.getEncryptedPassword = async function (password) {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, this.keyBytes, iv)
    const enc = [iv, cipher.update(password, 'utf8')]
    enc.push(cipher.final())
    password = Buffer.concat(enc).toString('base64')
    return password
  } catch (error) {
    throw error
  }
}

EncryptDecrpytPassword.prototype.getDecryptedPassword = async function (password) {
  try {
    const contents = Buffer.from(password, 'base64')
    const iv = contents.slice(0, 16)
    const textBytes = contents.slice(16)
    const decipher = crypto.createDecipheriv(this.algorithm, this.keyBytes, iv)
    let res = decipher.update(textBytes, '', 'utf8')
    res += decipher.final('utf8')
    return res
  } catch (error) {
    throw error
  }
}

EncryptDecrpytPassword.prototype.getDecryptedPasswordFromUser = async function (password) {
  try {
    var keyStr = 'J$()|/|*F@C#@RYF^#%!'
    const algorithm = 'aes-256-cfb'
    const hash = crypto.createHash('sha256')
    hash.update(keyStr)
    const keyBytes = hash.digest()
    const contents = Buffer.from(password, 'base64')
    const iv = contents.slice(0, 16)
    const textBytes = contents.slice(16)
    const decipher = crypto.createDecipheriv(algorithm, keyBytes, iv)
    let res = decipher.update(textBytes, '', 'utf8')
    res += decipher.final('utf8')
    return res
  } catch (error) {
    throw error
  }
}

export default new EncryptDecrpytPassword()

const bcrypt = require('bcrypt-nodejs');

const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'email']);
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.email) throw new ValidationError('Email é um atributo obrigatório');
    if (!user.password) throw new ValidationError('Senha é um atributo obrigatório');

    const userDb = await findOne({ email: user.email });
    if (userDb) throw new ValidationError('Já existe usuário com esse email');

    const newUser = { ...user };
    newUser.password = getPasswordHash(user.password);
    return app.db('users').insert(newUser, ['id', 'name', 'email']);
  };

  return { findAll, save, findOne };
};

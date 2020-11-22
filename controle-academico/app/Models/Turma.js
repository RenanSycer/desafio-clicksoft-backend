'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Turma extends Model {
    aluno(){
        return this.belongsToMany('App/Models/Aluno')
    }

    professor(){
        return this.hasOne('App/Models/Professor')
    }
}

module.exports = Turma

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Aluno extends Model {
    turma(){
        return this.belongsToMany('App/Models/Turma')
    }
}

module.exports = Aluno

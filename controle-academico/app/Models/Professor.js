'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Professor extends Model {
    turmas(){
        return this.hasMany('App/Models/Turma')
    }
}

module.exports = Professor

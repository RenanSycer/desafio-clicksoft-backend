'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TurmaSchema extends Schema {
  up () {
    this.create('turmas', (table) => {
      table.increments()
      table.integer('numero_sala').unsigned().notNullable().unique()
      table.integer('capacidade').unsigned().notNullable().unique()
      table.boolean('disponibilidade').defaultTo(false)
      table.integer('professor_id').unsigned()
      table.timestamps()

      table
        .foreign('professor_id')
        .references('id')
        .inTable('professors')
        .onDelete('cascade')
    })

    this.create('aluno_turma',(table) => {
    
      table.increments()
      table.integer('numero_sala').unsigned().notNullable()
      table.integer('aluno_id').unsigned()

      table
        .foreign('aluno_id')
        .references('id')
        .inTable('alunos')
        .onDelete('cascade')

        table
        .foreign('id') //referente ao primary key da tabela turmas (id) - think on turma_id
        .references('id')
        .inTable('turmas')
        .onDelete('cascade')  
    })
  }

  down () {
    this.drop('aluno_turma')
    this.drop("professor_turma")
    this.drop('turmas')
  }
}

module.exports = TurmaSchema

'use strict'

const Turma = use('App/Models/Turma')
const Aluno = use('App/Models/Aluno')
const Professor = use('App/Models/Professor')
const { validateAll } =  use('Validator')
const Database =   use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with turmas
 */
class TurmaController {

  /**
   * Create/save a new turma.
   * POST turmas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request, response }) {
    try {
      const professor = await Professor.findOrFail(params.id)
      
      if (!professor) {
        return response.status(404).send({message:'Não há nenhum professor com essa identifiação'})
      }
      
      const data = request.only(["numero_sala","capacidade","disponibilidade"])
      
      data.professor_id = params.id
      
      await professor.turmas().create(data)
     
      return data

    } catch (error) {

      return response.status(500).send({error:`Erro: ${error.message}`})
    
    }
  }

  /**
   * Display a single turma.
   * GET turmas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({params, response}) {
    
    try {
      let turma = await Professor.query()
      .select('numero_sala','capacidade','disponibilidade','professor_id').from('turmas').where('id', params.id).fetch()
      
      if (!turma) {
        return response.status(404).send({message:'Não há nenhum turma cadastrada'})
      } 
      
      return turma

    } catch (error) {
        return response.status(500).send({error:`Erro: ${error.message}`})
    }
  }

  /**
   * Update turma details.
   * PUT or PATCH turmas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {

    try {

      const  {numero_sala,capacidade,disponibilidade,professor_id} = request.all();
      const turma = await Turma.findBy('id',params.id_turma)

      if (!turma) {
        return response.status(404).send({message:'Não há turma com o id informado'})
      }
      
      turma.numero_sala = numero_sala
      turma.capacidade = capacidade
      turma.disponibilidade = disponibilidade
      turma.professor_id = professor_id 
  
      await turma.save() 
      
      return turma

    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
  }

  /**
   * Delete a turma with id.
   * DELETE turmas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

    try {
      const turma = await Turma.findBy('id',params.id)

      if (!turma) {
        return response.status(404).send({message:'Não há turma com o id informado'})
      }
      
      await turma.delete()
      return response.status(200).send({message:'A deleção foi realizada com sucesso '})

    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
  }

  /**
   * Create/save a new turma.
   * POST turmas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async adicionarAlunoTurma ({ params, request, response }) {

    try {

      const data = request.only(["numero_sala","aluno_id"])
      const aluno = await Aluno.findBy('id',data.aluno_id)
  
      if (!aluno) {
        return response.status(404).send({message:'Não há aluno com o id informado'})
      }
  
      const turma = await Turma.findBy('id',data.numero_sala)
      
      if (!turma) {
        return response.status(404).send({message:'Não há turma com o id informado'})
      }
      
      const professor = await Professor.findBy('id',params.id)
    
      if (!professor) {
        return response.status(404).send({message:'Não há professor com o id informado'})
      
      } else if (professor.id != turma.professor_id) {
        
        return response.status(500).send({message:'Essa turma não pertence a este professor'})
      }

      let queryTurma = await Turma.query().select('*').from('aluno_turma').where({ numero_sala: data.numero_sala }).fetch()
      let qtd_turmas = queryTurma.rows.length

      if ( qtd_turmas < turma.capacidade ) {
        
      await Database.insert({numero_sala: data.numero_sala, aluno_id: data.aluno_id}).into('aluno_turma')
 
      } else {
        return response.status(500).send({message:'Não foi possivel alocar o aluno na turma'})
      }

      return data
      
    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }

  }
}

module.exports = TurmaController

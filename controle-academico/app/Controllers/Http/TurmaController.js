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
   * Show a list of all turmas.
   * GET turmas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new turma.
   * GET turmas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

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

    /* if (!professor) {
      return response.status(404).send({message:'Não há nenhum professor com essa identifiação'})
    } */

    // let data = await Professor.query().select('*').from('turmas').where('professor_id', params.id).fetch()

    // let professor = await Professor.query().where('matricula', params.id).firstOrFail();
    //await professor.load('turmas')
  }

  /**
   * Render a form to update an existing turma.
   * GET turmas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
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
  async adicionarAlunoTurma ({ request, response }) {

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
      


      let query = await Aluno.query().select('*').from('aluno_turma').where({aluno_id : data.aluno_id, numero_sala: data.numero_sala }).fetch() 
      console.log(query)
      console.log(data)
      
      if (query.isOne == false) {

        await Database.insert({numero_sala: data.numero_sala, aluno_id: data.aluno_id}).into('aluno_turma')
      
      } else {
      
        return response.status(500).send({message:'Aluno já cadastrado posteriormente na turma'})
      
      }

      return data
      
    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
  
  }
}

module.exports = TurmaController

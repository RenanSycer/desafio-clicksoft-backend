'use strict'

const { query } = require('../../Models/Professor')
const Professor = use('App/Models/Professor')
const Turma = use('App/Models/Turma')
const { validateAll } =  use('Validator')
const Database =   use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with professors
 */
class ProfessorController {
  /**
   * Show a list of all professors.
   * GET professors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new professor.
   * GET professors/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response  }) {
    try {

      const validation =  await validateAll(request.all(), {
        matricula:'required|unique:professors',
        nome: 'required',
        email: 'required|unique:professors',
        data_nascimento: 'required'
      })
    
      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      } 

      const data = request.only(["matricula","nome","email","data_nascimento"])

      const professor =  await Professor.create(data)
      
      return professor

    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
  }

  /**
   * Create/save a new professor.
   * POST professors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * 
   */
  async store ({ request, response }) {
 }

  /**
   * Display a single professor.
   * GET professors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {

    try {

     // let professor = await Professor.query().where('matricula', params.id).firstOrFail();
      let professor = await Professor.findBy('matricula',params.id)

      if (!professor) {
        return response.status(404).send({message:'Nenhum registro foi encontrado'})
      }

      return professor

    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
  }

  /**
   * Render a form to update an existing professor.
   * GET professors/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update professor details.
   * PUT or PATCH professors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {

    const  {nome,email, data_nascimento} = request.all();
    const professor = await Professor.findBy('matricula',params.id)

    if (!professor) {
      return response.status(404).send({message:'Nenhum registro foi encontrado'})
    }

    professor.nome = nome
    professor.email = email
    professor.data_nascimento = data_nascimento
    professor.matricula = params.id
    
    await professor.save()

    return professor 
  }

  /**
   * Delete a professor with id.
   * DELETE professors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const professor = await Professor.findBy('matricula',params.id)
    
    if (!professor) {
      return response.status(404).send({message:'Nenhum registro foi encontrado'})
    }
    
    await professor.delete()
    return response.status(200).send({message:'A deleção foi realizada com sucesso '})
  }
}

module.exports = ProfessorController

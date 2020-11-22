'use strict'

const { query } = require('../../Models/Aluno')
const Aluno = require('../../Models/Aluno')
const { validateAll } =  use('Validator')
const Database =   use('Database')

const Usaer = use('App/Models/Aluno')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with alunos
 */
class AlunoController {
  /**
   * Show a list of all alunos.
   * GET alunos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
/*   async index ({ request, response  }) {
    const data = request.only(["matricula"])
    const lista_aluno =  Database.from('alunos').where('matricula','=',  data)
    return response.send(lista_aluno)
  } */

  /**
   * Render a form to be used for creating a new aluno.
   * GET alunos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response }) {
    
    try {

      const validation =  await validateAll(request.all(), {
        matricula:'required|unique:alunos',
        nome: 'required',
        email: 'required|unique:alunos',
        data_nascimento: 'required'
      })

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const data = request.only(["matricula","nome","email","data_nascimento"])

      const aluno = await Aluno.create(data)
      
      return aluno

    } catch (error) {
      return response.status(500).send({error:`Erro: ${error.message}`})
    }
   
  }

  /**
   * Create/save a new aluno.
   * POST alunos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single aluno.
   * GET alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response  }) {

    try {
      /* await Aluno.query().whereNotExists(function () {
        this.from('aluno').where('matricula', params.id).fetch()
      }) */
      //const data = await Aluno.query().where('matricula', params.id).fetch()

     /*  const data = await Aluno.query().whereExists(function () {
        this.from('alunos').where('matricula', params.id)
      }).where() */
    
      const aluno = await Aluno.findBy('matricula',params.id)

      if (!aluno) {
        return response.status(404).send({message:'Nenhum registro foi encontrado'})
        
      }

      return aluno

    } catch (error) {

      return response.status(500).send({error:`Erro: ${error.message}`})
    }

    
   // const lista_aluno =  Database.from('alunos').where('matricula','=',  data)
  }

  /**
   * Render a form to update an existing aluno.
   * GET alunos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update aluno details.
   * PUT or PATCH alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
   
    const  {nome,email, data_nascimento} = request.all();
    const aluno = await Aluno.findBy('matricula',params.id)
    if (!aluno) {
      return response.status(404).send({message:'Nenhum registro foi encontrado'})
      
    }

    aluno.nome = nome
    aluno.email = email
    aluno.data_nascimento = data_nascimento
    aluno.matricula = params.id
    
    await aluno.save()

    return aluno 
  }

  /**
   * Delete a aluno with id.
   * DELETE alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

    const aluno = await Aluno.findBy('matricula',params.id)
    
    if (!aluno) {
      return response.status(404).send({message:'Nenhum registro foi encontrado'})
    }
    
    await aluno.delete()
    return response.status(200).send({message:'O deleção realizada com sucesso '})
  }
}

module.exports = AlunoController

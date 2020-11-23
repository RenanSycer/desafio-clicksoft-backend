'use strict'

const { query } = require('../../Models/Aluno')
const Aluno = require('../../Models/Aluno')
const Turma = use('App/Models/Turma')
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
      const aluno = await Aluno.findBy('matricula',params.id)

      if (!aluno) {
        return response.status(404).send({message:'Nenhum registro foi encontrado'})
        
      }

      return aluno

    } catch (error) {

      return response.status(500).send({error:`Erro: ${error.message}`})
    }

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

  async listarTurmas ({ params, request, response }){
    const aluno = await Aluno.findBy('id',params.id)
    
    if (!aluno) {
      return response.status(404).send({message:'Nenhum registro foi encontrado'})
    }

    let alunoturma = await Aluno.query().select('*').from('aluno_turma').where('aluno_id', params.id).fetch()

  return alunoturma 
  }
}

module.exports = AlunoController

'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
}) 

Route.post("/aluno", "AlunoController.create")
Route.get("/aluno/show/:id", "AlunoController.show")
Route.put("/aluno/update/:id", "AlunoController.update")
Route.delete('/aluno/delete/:id', "AlunoController.destroy")

Route.get('/aluno/show/turmas/:id', "AlunoController.listarTurmas")

Route.post("/professor","ProfessorController.create")
Route.get("/professor/show/:id", "ProfessorController.show")
Route.put("/professor/update/:id", "ProfessorController.update")
Route.delete('/professor/delete/:id', "ProfessorController.destroy")

Route.post('professor/:id/turma','TurmaController.store')
Route.get("/professor/turma/show/:id", "TurmaController.show")
Route.put("/professor/turma/update/:id_turma", "TurmaController.update")
Route.delete('/professor/turma/delete/:id', "TurmaController.destroy")
Route.post('/professor/:id/turma/adicionarAluno/', 'TurmaController.adicionarAlunoTurma')
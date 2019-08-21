const { Router } = require('express');

const routes = new Router();

const projects = [];
let number = 1; // numero de req
const checkRequisitions = (req, res, next) => {
  console.log('Numero de requisições feitas: ', number++);
  return next();
};

const idCheckerMiddleware = (req, res, next) => {
  const { id } = req.params;

  const projectExist = projects.find(project => project.id === id);

  if (!projectExist)
    return res.status(401).json({ message: 'projeto não encontrado' })

  return next();
};

routes.get('/projects', checkRequisitions, (req, res) => res.json(projects));

routes.get('/projects/:id', checkRequisitions, idCheckerMiddleware, (req, res) => {
  const { id } = req.params;

  const project = projects.find(project =>
    project.id === id && project);

  return res.json(project)
});

routes.post('/projects', checkRequisitions, (req, res) => {

  const project = req.body;

  const projectAdded = projects.find((proj, index) =>
    project.id === proj.id && (projects[index] = { ...project, tasks: [] }))

  if (!projectAdded)
    projects.push({ ...project, tasks: [] })

  return res.send({ message: 'adicionado com sucesso!', projectAdded });
});

routes.post('/projects/:id/tasks', checkRequisitions, idCheckerMiddleware, (req, res) => {
  const { task } = req.body;
  const { id } = req.params;

  projects.map((project, index) =>
    project.id === id && (projects[index].tasks.push(task)));

  return res.json({ message: 'tarefa adicionado com sucesso' });
});

routes.put('/projects/:id', checkRequisitions, idCheckerMiddleware, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map((project, index) =>
    project.id === id && (projects[index].title = title));

  return res.send({ message: 'atualizado com sucesso!' });
});

routes.delete('/projects/:id', checkRequisitions, idCheckerMiddleware, (req, res) => {
  const { id } = req.params;

  projects.map((project, index) =>
    project.id === id && (projects.splice(index, 1)));

  return res.send({ message: 'deletado com sucesso!' })
});

module.exports = routes;

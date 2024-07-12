const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true
  }
];

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});

app.get('/tasks', (req, res) => {
  res.status(200).send(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).send({ message: 'Task ID is not provided as part of the request' });
  }

  const task = tasks.find(task => task.id == taskId);
  if (!task) {
    return res.status(404).send({ message: 'Task not found' });
  }

  res.status(200).send(task);
});

app.post('/tasks', (req, res) => {
  const task = req.body.task;

  if (!task) {
    return res.status(400).send({ message: 'Task object is not provided as part of the request' });
  }

  try {
    tasks.push(task);
    res.status(201).send({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while creating the task', error: error.message });
  }
});

app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body.task;

  if (!taskId || !updatedTask) {
    return res.status(400).send({ message: 'Task object or task ID not provided as part of the request' });
  }

  try {
    const taskIndex = tasks.findIndex(task => task.id == taskId);

    if (taskIndex === -1) {
      return res.status(404).send({ message: 'Task not found' });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

    res.status(200).send({ message: 'Task updated successfully', task: tasks[taskIndex] });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while updating the task', error: error.message });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).send({ message: 'Task ID not provided as part of the request' });
  }

  try {
    const taskIndex = tasks.findIndex(task => task.id == taskId);

    if (taskIndex === -1) {
      return res.status(404).send({ message: 'Task ID not found' });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while deleting the task', error: error.message });
  }
});

module.exports = app;

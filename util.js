const faker = require('faker');

const generateUser = ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  department,
  createdAt = new Date()
} = {}) => ({
  firstName,
  lastName,
  department,
  createdAt
});

const articleGenerator = ({
  name= faker.name.jobTitle(),
  description= faker.name.jobDescriptor(),
  type,
  tags=[]
} = {}) => ({
    name,
    description,
    type,
    tags
})
module.exports = {
  mapUser: generateUser,
  mapArticle:articleGenerator,
  getRandomFirstName: () => faker.name.firstName()
};

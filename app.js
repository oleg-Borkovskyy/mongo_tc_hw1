'use strict';
const {mapUser, getRandomFirstName, mapArticle} = require('./util');

// db connection and settings
const connection = require('./config/connection');
let userCollection;

//!for Articles
let articleCollection;

//! for students from JSON file
// const students = require('./students.json');
// console.log(students);

//! for students from JSON file
// let studentsCollection
run();

async function run() {
  await connection.connect();
  //! for users
  // await connection.get().dropCollection('users')
  // await connection.get().createCollection('users')
  // userCollection = connection.get().collection('users')

  //! for students from JSON file
  // await connection.get().dropCollection('students')
  // await connection.get().createCollection('students')
  // studentsCollection = connection.get().collection('students')
  //! for students from JSON file
  // await exampleAll()

  //! FOR ARTICLES
  await connection.get().dropCollection('articles');
  await connection.get().createCollection('articles');
  articleCollection = connection.get().collection('articles');
  await exampleArt1();
  await exampleArt2();
  await exampleArt3();
  await exampleArt4();
  await exampleArt5();

  //! for users
  // await example1()
  // await example2()
  // await example3()
  // await example4()
  await connection.close();
}

// #### Usenpmrs

//* - Create 2 users per department (a, b, c)
async function example1() {
  const departments = ['a', 'a', 'b', 'b', 'c', 'c'];
  const users = departments.map(d => ({department: d})).map(mapUser);
  // console.log('--------------------------');
  // console.log(users);
  // console.log('--------------------------');
  try {
    const {result} = await userCollection.insertMany(users);
    console.log(`Added ${result.n} users`);
  } catch (err) {
    console.error(err);
  }
}

//* - Delete 1 user from department (a)
async function example2() {
  try {
    //*query={department:'a'}
    const {result} = await userCollection.deleteOne({department: 'a'});
    console.log(`Removed ${result.n} user`);
  } catch (err) {
    console.error(err);
  }
}

//* - Update firstName for users from department (b)
async function example3() {
  try {
    const usersDepB = await userCollection.find({department: 'b'}).toArray();
    const bulkWrite = usersDepB.map(user => ({
      updateOne: {
        filter: {_id: user._id},
        update: {$set: {firstName: getRandomFirstName()}}
      }
    }));
    const {result} = await userCollection.bulkWrite(bulkWrite);
    console.log(`Updated ${result.nModified} users`);
  } catch (err) {
    console.error(err);
  }
}

//* - Find all users from department (c)
async function example4() {
  try {
    const users = [...(await userCollection.find({department: 'c'}).toArray())];
    console.log('==========================');
    console.log('- Find all users from department (c)');
    console.log(users.map(el => el.firstName));
    console.log('==========================');
  } catch (err) {
    console.error(err);
  }
}

//! for students from JSON file
//! its working Don't touch it =)

// async function exampleAll() {
//   try {
//     const { result } = await studentsCollection.insertMany(students)
//     console.log('==========================');
//     console.log(`Added ${result.n} users`)
//     console.log('==========================');
//   } catch (err) {
//     console.error(err)
//   }
// }

//! ARTICLES functions
//*Create 5 articles per each type (a, b, c)
async function exampleArt1() {
  let types = [];

  for (let i = 0; i < 5; i++) {
    types = [...types, ...['a', 'b', 'c']];
  }

  const articles = types.map(d => ({type: d})).map(mapArticle);

  try {
    const {result} = await articleCollection.insertMany(articles);
    console.log('========articles==========');
    console.log(`Added ${result.n} articles`);
    console.log('==========================');
  } catch (err) {
    console.error(err);
  }
}

//*Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]
async function exampleArt2() {
  try {
    const articlesTypeA = await articleCollection.find({type: 'a'}).toArray();
    const bulkWrite = articlesTypeA.map(art => ({
      updateOne: {
        filter: {_id: art._id},
        update: {$set: {tags: ['tag1-a', 'tag2-a', 'tag3']}}
      }
    }));
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Updated ${result.nModified} articles`);
  } catch (err) {
    console.error(err);
  }
}

//*Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a
async function exampleArt3() {
  try {
    // const articlesTypeA = await articleCollection.find({ type: 'a' }).toArray()
    const articlesTypeBC = await articleCollection.find({type: {$in: ['b', 'c']}}).toArray();
    const bulkWrite = articlesTypeBC.map(art => ({
      updateOne: {
        filter: {_id: art._id},
        update: {$set: {tags: ['tag2', 'tag3', 'super']}}
      }
    }));
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Updated ${result.nModified} articles`);
  } catch (err) {
    console.error(err);
  }
}

//*Find all articles that contains tags [tag2, tag1-a]
async function exampleArt4() {
  try {
    const articlesByTags = await articleCollection
      .find({tags: {$in: ['tag2', 'tag1-a']}})
      .toArray();
    console.log('=======exampleArt4========');
    console.log(`find ${articlesByTags.map(art => art.name)} articles`);
    console.log('==========================');
  } catch (err) {
    console.error(err);
  }
}

//*Pull [tag2, tag1-a] from all articles
async function exampleArt5() {
  try {
    const articlesByTags = await articleCollection
      .find({tags: {$in: ['tag2', 'tag1-a']}})
      .toArray();
    const bulkWrite = articlesByTags.map(art => ({
      updateOne: {
        filter: {_id: art._id},
        update: {$pull: {tags: {$in: ['tag2', 'tag1-a']}}}
      }
    }));
    const {result} = await articleCollection.bulkWrite(bulkWrite);
    console.log(`Updated ${result.nModified} articles`);
  } catch (err) {
    console.error(err);
  }
}

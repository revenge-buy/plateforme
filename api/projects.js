import client from "./client"

export async function getProjects() {
  const projects = await client.fetch(
    `
      * [_type == "projects" && status == "active"]{
        _id,
        creator->{
          firstName,
          lastName,
          profilePicture
        },
        name,
        _createdAt,
        "productImage": *[_type == "product" && references(^._id)][0].image
      }
    `
  )
  return projects
}

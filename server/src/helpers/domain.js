import fs from 'fs'
import path from 'path'

const domain = { }
const domainsDir = path.join(process.cwd(), 'skills')

domain.getDomainsObj = async () => {
  const domainsObj = { }

  await Promise.all(fs.readdirSync(domainsDir).map(async (entity) => {
    const domainPath = path.join(domainsDir, entity)

    if (fs.statSync(domainPath).isDirectory()) {
      const skillObj = { }
      const { name: domainName } = await import(path.join(domainPath, 'domain.json'))
      const skillFolders = fs.readdirSync(domainPath)

      for (let i = 0; i < skillFolders.length; i += 1) {
        const skillPath = path.join(domainPath, skillFolders[i])

        if (fs.statSync(skillPath).isDirectory()) {
          const { name: skillName, type: skillType } = JSON.parse(fs.readFileSync(path.join(skillPath, 'skill.json'), 'utf8'))

          skillObj[skillName] = {
            name: skillFolders[i],
            type: skillType,
            path: skillPath
          }
        }

        domainsObj[domainName] = {
          name: entity,
          path: domainPath,
          skills: skillObj
        }
      }
    }

    return null
  }))

  return domainsObj
}

domain.list = async () => Object.keys(await domain.getDomainsObj())

domain.getDomainName = (domain) => {
  const { name: domainName } = JSON.parse(fs.readFileSync(
    path.join(domainsDir, domain, 'domain.json'),
    'utf8'
  ))

  return domainName
}

domain.getSkillName = (domain, skill) => {
  const { name: skillName } = JSON.parse(fs.readFileSync(
    path.join(domainsDir, domain, skill, 'skill.json'),
    'utf8'
  ))

  return skillName
}

export default domain
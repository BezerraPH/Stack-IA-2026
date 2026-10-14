/**
 * Skill Loader: Gerenciador de Habilidades da Camada 2
 * Carrega as instruções padronizadas (SKILL.md) sob demanda para os agentes da Camada 3.
 */

const fs = require('fs');
const path = require('path');

class SkillLoader {
  constructor(skillsDir = path.join(__dirname, 'skills')) {
    this.skillsDir = skillsDir;
    this.skillsCache = new Map();
  }

  /**
   * Lista todas as habilidades disponíveis
   */
  listSkills() {
    if (!fs.existsSync(this.skillsDir)) return [];
    const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const skillPath = path.join(this.skillsDir, entry.name, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
          return this.getSkill(entry.name);
        }
        return null;
      })
      .filter(Boolean);
  }

  /**
   * Carrega uma habilidade pelo identificador
   */
  getSkill(skillName) {
    if (this.skillsCache.has(skillName)) {
      return this.skillsCache.get(skillName);
    }

    const skillFilePath = path.join(this.skillsDir, skillName, 'SKILL.md');
    if (!fs.existsSync(skillFilePath)) {
      throw new Error(`Habilidade não encontrada: ${skillName}`);
    }

    const content = fs.readFileSync(skillFilePath, 'utf8');
    const parsed = this._parseSkillMarkdown(content);
    parsed.id = skillName;
    parsed.filePath = skillFilePath;

    this.skillsCache.set(skillName, parsed);
    return parsed;
  }

  _parseSkillMarkdown(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return {
        metadata: {},
        instructions: content
      };
    }

    const yamlStr = match[1];
    const markdownBody = match[2];
    const metadata = {};

    yamlStr.split(/\r?\n/).forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        metadata[key] = value;
      }
    });

    return {
      metadata,
      instructions: markdownBody.trim()
    };
  }
}

module.exports = new SkillLoader();

export interface CoverLetterInput {
  companyName: string;
  role: string;
  jobDescription: string;
  resume: string;
}

export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const skills = extractKeywords(input.resume);
      const requirements = extractKeywords(input.jobDescription);
      const matchedSkills = skills.filter((skill) =>
        requirements.some(
          (req) => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase())
        )
      );
      const topSkills = matchedSkills.slice(0, 4).length > 0 ? matchedSkills.slice(0, 4) : skills.slice(0, 4);

      const letter = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${input.role} position at ${input.companyName}. With a strong background and a passion for excellence, I am confident that I would be a valuable addition to your team.

Throughout my career, I have developed expertise in ${topSkills.length > 0 ? topSkills.join(", ") : "relevant areas"} — skills that align closely with the requirements outlined in your job description. I am particularly drawn to this opportunity because of ${input.companyName}'s reputation for innovation and excellence in the industry.

${input.resume.length > 50 ? `My professional journey has equipped me with the technical proficiency and collaborative mindset necessary to thrive in the ${input.role} role. I have consistently delivered results by leveraging my strengths in ${topSkills.length > 0 ? topSkills.slice(0, 2).join(" and ") : "key areas"}, and I am eager to bring that same dedication to ${input.companyName}.` : `I am eager to bring my skills, enthusiasm, and dedication to ${input.companyName} as part of the ${input.role} team.`}

I would welcome the opportunity to discuss how my experience and qualifications can contribute to the continued success of ${input.companyName}. Thank you for considering my application. I look forward to the possibility of contributing to your team.

Warm regards,
[Your Name]`;

      resolve(letter);
    }, 2000);
  });
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "and", "but", "or", "not", "this", "that", "it",
    "its", "i", "my", "me", "we", "our", "you", "your", "they", "their",
    "them", "he", "she", "him", "her", "experience", "work", "working",
    "team", "role", "position", "company", "job", "skill", "skills",
    "years", "year", "including", "such", "other", "all", "any",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

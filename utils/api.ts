import axios from 'axios'

export interface TimelineData {
  title: string;
  datePublished: string;
  content: string;
  fullContent: string[];
  readTime: string;
  readText: string;
  readLinks: { text: string; link: string }[];
}

export interface ProjectsData {
  title: string;
  content: string;
  language: string;
  link: string;
}

export interface EmailResponse {
  message: string;
  status: number;
}

export async function fetchTimelineData (): Promise<TimelineData[]> {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/oloko64/oloko64-dev/main/dynamic-data/files/timeline/timeline.json'
    )
    if (!data) {
      return []
    }
    return data.map((fileData: any) => {
      return {
        title: fileData.title,
        datePublished: fileData['date-published'],
        content: fileData.content,
        fullContent: fileData['full-content'],
        readTime: fileData['read-time'],
        readText: fileData['read-text'],
        readLinks: fileData['read-links']
      }
    })
  } catch (_) {
    return []
  }
}

export async function fetchProjectsData (): Promise<ProjectsData[]> {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/oloko64/oloko64-dev/main/dynamic-data/files/projects/projects.json'
    )
    if (!data) {
      return []
    }
    return data
  } catch (_) {
    return []
  }
}

export async function sendContactEmail (contact: string, subject :string, body: string) : Promise<EmailResponse> {
  const { data } = await axios.post('https://ztibn43ge3bz2jx63o6j45rtna0otrkn.lambda-url.us-east-1.on.aws/send-message', { contact, subject, body })
  return data
}

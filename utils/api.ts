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

interface RawTimelineData {
  title: string;
  'date-published': string;
  content: string;
  'full-content': string[];
  'read-time': string;
  'read-text': string;
  'read-links': { text: string; link: string }[];
}

export interface EmailResponse {
  message: string;
  status: number;
}

export async function fetchTimelineData (): Promise<TimelineData[]> {
  try {
    const { data } = await axios.get<RawTimelineData[]>(
      'https://raw.githubusercontent.com/oloko64/oloko64-dev/main/dynamic-data/files/timeline/timeline.json'
    )
    if (!data) {
      return []
    }
    return data.map((fileData) => {
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
  } catch {
    return []
  }
}

export async function fetchProjectsData (): Promise<ProjectsData[]> {
  try {
    const { data } = await axios.get<ProjectsData[]>(
      'https://raw.githubusercontent.com/oloko64/oloko64-dev/main/dynamic-data/files/projects/projects.json'
    )
    if (!data) {
      return []
    }
    return data
  } catch {
    return []
  }
}

export async function sendContactEmail (contact: string, subject :string, body: string) : Promise<EmailResponse> {
  const { data } = await axios.post<EmailResponse>('https://cmt3c5s36x3cfgmn27feawwfje0erfxd.lambda-url.us-east-1.on.aws/v1/send-message', { contact, subject, body })
  return data
}

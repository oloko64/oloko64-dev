import { fetchTimelineData, fetchProjectsData, type TimelineData, type ProjectsData } from '~/utils/api'

export const useData = () => {
  const timeline = useState<TimelineData[]>('timeline', () => [])
  const projects = useState<ProjectsData[]>('projects', () => [])

  const fetchTimeline = async () => {
    if (timeline.value.length > 0) return
    timeline.value = await fetchTimelineData()
  }

  const fetchProjects = async () => {
    if (projects.value.length > 0) return
    projects.value = await fetchProjectsData()
  }

  return {
    timeline,
    projects,
    fetchTimeline,
    fetchProjects
  }
}

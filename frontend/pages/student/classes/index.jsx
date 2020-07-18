import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks'

import PageTitle from '../../../components/PageTitle';
import Loading from '../../../components/Loading';
import CourseTimelines from '../../../components/courses/CourseTimelines';

const ENROLLED_COURSES_QUERY = gql`
  query ENROLLED_COURSES_QUERY {
    getCoursesEnrolled {
      _id
      name
      subject
      essentialPlaylists {
        _id
        name
        type
      }
      corePlaylists {
        _id
        name
        type
      }
      challengePlaylists {
        _id
        name
        type
      }
    }
    getScores {
      score
      possibleScore
      _id
      playlist {
        _id
        name
      }
    }
  }
`;

const studentClasses = () => {
  const { loading, error, data } = useQuery(ENROLLED_COURSES_QUERY);
  if (error) return null;
  if (loading) return <Loading />;

  const coursesWithScores = data.getCoursesEnrolled.map(course => {
    // for essential playlists
    course.essentialPlaylists.map(playlist => {
      playlist.best = null;
      data.getScores.forEach(score => {
        if (score.playlist._id === playlist._id) {
          const percent = parseInt(score.score / score.possibleScore * 100);
          if (percent > playlist.best) { playlist.best = percent }
        }
      })
      return playlist;
    })
    course.corePlaylists.map(playlist => {
      playlist.best = null;
      data.getScores.forEach(score => {
        if (score.playlist._id === playlist._id) {
          const percent = parseInt(score.score / score.possibleScore * 100);
          if (percent > playlist.best) { playlist.best = percent }
        }
      })
      return playlist;
    })
    course.challengePlaylists.map(playlist => {
      playlist.best = null;
      data.getScores.forEach(score => {
        if (score.playlist._id === playlist._id) {
          const percent = parseInt(score.score / score.possibleScore * 100);
          if (percent > playlist.best) { playlist.best = percent }
        }
      })
      return playlist;
    })
    return course;
  })

  return (
    <div>
      <PageTitle>All Classes</PageTitle>
      {coursesWithScores && (
        coursesWithScores.map(course => {
          if (course.essentialPlaylists.length > 0 || course.corePlaylists.length) {
            return (
              <CourseTimelines
                name={course.name}
                courseId={course._id}
                essentialPlaylists={course.essentialPlaylists}
                corePlaylists={course.corePlaylists}
                challengePlaylists={course.challengePlaylists}
                subject={course.subject}
                key={course._id}
              />
            )
          }
        })
      )}
    </div >
  );
};

export default studentClasses;
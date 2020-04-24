import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get, map, omit } from 'lodash'
import {
  useFirestore,
  useDatabase,
  useDatabaseObjectData,
  useFirestoreDocData
} from 'reactfire'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { triggerAnalyticsEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import PermissionsTableRow from '../PermissionsTableRow'
import DeleteMemberModal from '../DeleteMemberModal'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import styles from './PermissionsTable.styles'

const useStyles = makeStyles(styles)

function PermissionsTable({ projectId }) {
  const classes = useStyles()
  const { showError, showSuccess } = useNotifications()
  const [deleteDialogOpen, changeDeleteDialogOpen] = useState(false)
  const [selectedMemberId, changeSelectedMemberId] = useState('')
  const handleDeleteClose = () => changeDeleteDialogOpen(false)
  const startDelete = (selectedId) => {
    changeDeleteDialogOpen(true)
    changeSelectedMemberId(selectedId)
  }
  const database = useDatabase()
  const displayNamesRef = database.ref('displayNames')
  const displayNames = useDatabaseObjectData(displayNamesRef)

  const firestore = useFirestore()
  const projectRef = firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`)
  const project = useFirestoreDocData(projectRef)

  const selectedMemberName = get(
    displayNames,
    selectedMemberId,
    selectedMemberId
  )
  const { roles, permissions: unpopulatedPermissions } = project || {}
  const populatedPermissions = map(
    unpopulatedPermissions,
    (permission, uid) => ({
      ...permission,
      uid,
      displayName: get(displayNames, uid),
      roleName: get(roles, permission.role)
    })
  )

  async function removeMember(uid) {
    const {
      permissions: currentPermissions,
      collaborators: currentCollaborators
    } = project.permissions
    const permissions = omit(currentPermissions, [uid])
    const collaborators = omit(currentCollaborators, [uid])
    try {
      await firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`).set(
        {
          permissions,
          collaborators
        },
        { merge: true }
      )
      triggerAnalyticsEvent('removeCollaborator', {
        projectId,
        removedCollaboratorUid: uid
      })
      showSuccess('Member removed successfully')
    } catch (err) {
      showError(`Error removing member: ${err.message || 'Internal Error'}`)
      console.error(`Error removing member: ${err.message}`, err) // eslint-disable-line no-console
      throw err
    }
  }

  return (
    <div>
      <Paper square className={classes.headingPaper}>
        <span className={classes.headerLeft}>Member</span>
        <span>Role</span>
      </Paper>
      <DeleteMemberModal
        open={deleteDialogOpen}
        name={selectedMemberName}
        uid={selectedMemberId}
        onRequestClose={handleDeleteClose}
        onDeleteClick={removeMember}
      />
      {map(populatedPermissions, ({ role, uid, displayName }, index) => (
        <PermissionsTableRow
          key={`${uid}-${role}`}
          uid={uid}
          roleKey={role}
          displayName={displayName}
          projectId={projectId}
          initialValues={{ role }}
          onDeleteClick={startDelete}
        />
      ))}
    </div>
  )
}

PermissionsTable.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default PermissionsTable

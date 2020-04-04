import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { useFirestore, useAuth, useFirestoreCollectionData } from 'reactfire'
import styles from './PrivateActionTemplates.styles'
import NoTemplatesFound from './NoTemplatesFound'

const useStyles = makeStyles(styles)

function PrivateActionTemplates({ onTemplateClick }) {
  const classes = useStyles()
  const firestore = useFirestore()
  const auth = useAuth()
  const actionTemplatesQuery = firestore
    .collection('actionTemplates')
    .where('createdBy', '==', auth.currentUser.uid)
    .where('public', '==', false)
  const templates = useFirestoreCollectionData(actionTemplatesQuery)

  if (!templates.length) {
    return <NoTemplatesFound />
  }

  return (
    <div className={classes.root}>
      <List component="nav">
        <Divider />
        {map(templates, (item, idx) => [
          <ListItem
            button
            key={`PrivateTemplate-${item.id}-${idx}`}
            onClick={() => onTemplateClick(item)}>
            <ListItemText primary={item.name} />
          </ListItem>,
          <Divider key={`PrivateTemplateDivider-${item.id}-${idx}`} />
        ])}
      </List>
    </div>
  )
}

PrivateActionTemplates.propTypes = {
  templates: PropTypes.array, // from enhancer (firestoreConnect + connect)
  itemClickHandler: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default PrivateActionTemplates

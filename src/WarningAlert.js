import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

const WarningAlert = (props) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => setVisible(false)

  return (
    <Alert color="warning" isOpen={visible} toggle={onDismiss}>
      {props.type === 'availability' ? <>
        <strong>Uh-oh!</strong> This alias is already in use! <span role="img" aria-label="crying">😭</span>
      </> : <>
        This alias is invalid. Please refrain from using the following characters: <code>&, (, ), @, :, %, _, +, ., ~, #, ?, &, /, =, ;</code>.
      </>}
    </Alert>
  )
}

WarningAlert.propTypes = {
  type: PropTypes.string
}

export default WarningAlert

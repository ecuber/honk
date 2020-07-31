import React, { useState } from 'react'
import { Alert } from 'reactstrap'

const WarningAlert = (props) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => setVisible(false)

  return (
    <Alert color="warning" isOpen={visible} toggle={onDismiss}>
      <strong>Uh-oh!</strong> This alias is already in use! <span role="img" aria-label="crying">😭</span>
    </Alert>
  )
}

export default WarningAlert

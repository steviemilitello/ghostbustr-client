import React, { useState, useEffect } from 'react'
import { getOnePlace, updatePlace, removePlace } from '../../visited'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Container, Card, Button } from 'react-bootstrap'
import { showPlaceSuccess, showPlaceFailure } from '../shared/AutoDismissAlert/messages'
import EditPlaceModal from './EditPlaceModal'

const ShowVisited = (props) => {
 const [visited, setVisited] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [updated, setUpdated] = useState(false)
    const { user, msgAlert } = props
    const { id } = useParams()
    const navigate = useNavigate()

    console.log('id in showVisited', id)

    // empty dependency array in useEffect to act like component did mount
    useEffect(() => {
        getOneVisited(id)
            .then(res => setVisited(res.data.visited))
            .then(() => {
                msgAlert({
                    heading: 'The spooky visited has been retrieved!',
                    message: showVisitedSuccess,
                    variant: 'success',
                })
            })
            .catch(() => {
                msgAlert({
                    heading: 'Failed to find the spooky visited',
                    message: showVisitedFailure,
                    variant: 'danger',
                })
            })
    }, [updated])

    const removeTheVisited = () => {
        console.log("removeTheVisited id", visited.id)
        console.log("removeTheVisited _id", visited._id)

        removeVisited(user, visited._id)
            .then(() => {
                msgAlert({
                    heading: 'The spooky visited has been removed!',
                    message: 'The spooky visited has been deleted',
                    variant: 'success',
                })
            })
            .then(() => {navigate(`/`)})
            .catch(() => {
                msgAlert({
                    heading: 'Spooky Visited deletion failed.',
                    message: 'Failed to delete the spooky visited',
                    variant: 'danger',
                })
            })
    }

    if (!visited) {
        return (
            <Container fluid className="justify-content-center">
                <Spinner animation="border" role="status" variant="warning" >
                    <span className="visually-hidden">Loading....</span>
                </Spinner>
            </Container>
        )
    }

    return (
        <>
            <Container className="fluid">
                <Card>
                    <Card.Header>{visited.name}</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <small>Desscription: {visited.description}</small><br/>
                            <small>Location: {visited.location}</small><br/>
                            <small>Scare Level: {visited.scareLevel}</small><br/>
                            <small>
                                Visited : {visited.visited ? 'yes' : 'no'}
                            </small><br/>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                         <Button onClick={() => setModalOpen(true)} className="m-2" variant="warning">
                            Edit Visited
                        </Button>
                        <Button onClick={() => removeTheVisited()} className="m-2" variant="danger">
                            Delete Visited
                        </Button>
                    </Card.Footer>
                </Card>
            </Container>
            <EditVisitedModal 
                visited={visited}
                show={modalOpen}
                user={user}
                msgAlert={msgAlert}
                triggerRefresh={() => setUpdated(prev => !prev)}
                updateVisited={updateVisited}
                handleClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default ShowVisited
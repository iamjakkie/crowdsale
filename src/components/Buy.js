import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const Buy = ({ provider, price, crowdsale, setIsLoading }) => {
    return (
        <Form style={{ maxWidth: '800px', margin: '50px auto'}}>
            <Form.Group as={Row}>
                <Col>
                <Form.Control type="number" placeholder="Amount" />
                </Col>
                <Col className='text-center'>
                <Button variant='primary' type='Submit' style={{ width: '100%'}}>
                    BUY
                </Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

export default Buy;
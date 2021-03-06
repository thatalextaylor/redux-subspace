/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import { Provider, connect } from 'react-redux'
import configureStore from 'redux-mock-store'
import { render } from 'enzyme'

import subspaced from '../../src/components/subspaced'

describe('subspaced Tests', () => {

    it('should render subspaced component', () => {
        const TestComponent = connect(state => { return { value: state.value } })(props => (
            <p>{props.value}</p>
        ))
        const SubspacedComponent = subspaced(state => state.subState)(TestComponent)

        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        let testComponent = render(
            <Provider store={mockStore}>
                <SubspacedComponent />
            </Provider>
        )

        expect(testComponent.html()).to.equal("<p>expected</p>")
    })

    it('should render subspaced using namespace for substate', () => {
        const TestComponent = connect(state => { return { value: state.value } })(props => (
            <p>{props.value}</p>
        ))
        const SubspacedComponent = subspaced("subState")(TestComponent)

        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        let testComponent = render(
            <Provider store={mockStore}>
                <SubspacedComponent />
            </Provider>
        )

        expect(testComponent.html()).to.equal("<p>expected</p>")
    })

    it('should render subspaced component with props', () => {
        const TestComponent = connect(state => { return { value: state.value } })(props => (
            <p>{props.value} - {props.otherValue}</p>
        ))
        const SubspacedComponent = subspaced(state => state.subState, "test")(TestComponent)

        let state = {
            subState: {
                value: "expected"
            },
            value: "wrong"
        }

        let mockStore = configureStore()(state)

        let testComponent = render(
            <Provider store={mockStore}>
                <SubspacedComponent otherValue={"something else"} />
            </Provider>
        )

        expect(testComponent.html()).to.equal("<p>expected - something else</p>")
    })

    it('should render subspaced component using root state', () => {
        const TestComponent = connect(state => { return { value: state.value } })(props => (
            <p>{props.value}</p>
        ))
        const SubspacedComponent = subspaced((state, rootState) => ({ value: `${state.subState.value} - ${rootState.value}`}))(TestComponent)

        let state = {
            subState: {
                value: "expected 1"
            },
            value: "expected 2"
        }

        let mockStore = configureStore()(state)

        let testComponent = render(
            <Provider store={mockStore}>
                <SubspacedComponent />
            </Provider>
        )

        expect(testComponent.html()).to.equal("<p>expected 1 - expected 2</p>")
    })

    it('should use component name in display name', () => {
        const TestComponent = () => null

        const SubspacedComponent = subspaced(state => state)(TestComponent)

        expect(SubspacedComponent.displayName).to.equal("Subspaced(TestComponent)")
    })
})

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }
    render() {
     const { title, project, elapsed, runningSince, id, onFormSubmit, onDeleteTimer, onStartTimer, onStopTimer, timerIsRunning } = this.props;
     const { editFormOpen } = this.state;
     const handleOnClickCancel = () => this.setState({ editFormOpen: false })
     const handleOnClickEdit = () => this.setState({ editFormOpen: true })
     const handleTimerSubmit = (timerState, id) => {
         onFormSubmit(timerState, id);
         this.setState({ editFormOpen: false });
     }
     return (
         <div>
            {editFormOpen
                ? <TimerForm
                    id={id} 
                    title={title}
                    project={project}
                    onClickCancel={handleOnClickCancel}
                    onFormSubmit={handleTimerSubmit}/>
                : <Timer
                    id={id}
                    title={title}
                    project={project}
                    runningSince={runningSince}
                    elapsed={elapsed}
                    timerIsRunning={timerIsRunning}
                    onClickEdit={handleOnClickEdit}
                    onDeleteTimer={onDeleteTimer}
                    onStartTimer={onStartTimer}
                    onStopTimer={onStopTimer}/>
            }
        </div>
     )
    }
}
class EditableTimerList extends React.Component {
    render() {
        const { timers, onFormSubmit, onDeleteTimer, onStartTimer, onStopTimer } = this.props;
        return (
          <div>
            {timers && timers.map(({ title, project, elapsed, runningSince, id, timerIsRunning }) => 
            <EditableTimer
              key={id}
              id={id}
              title={title}
              project={project}
              elapsed={elapsed}
              runningSince={runningSince}
              timerIsRunning={timerIsRunning}
              onFormSubmit={onFormSubmit}
              onDeleteTimer={onDeleteTimer}
              onStartTimer={onStartTimer}
              onStopTimer={onStopTimer}/>
            )}
          </div>
        )
    }
}
class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false
    }
    render() {
        const { isOpen } = this.state;
        const { onFormSubmit } = this.props;
        const handleOnClickCancel = () => this.setState({ isOpen: false })
        const handleTimerSubmit = (timerState) => {
            onFormSubmit(timerState);
            this.setState({ isOpen: false });
        }
        return (
            <div>
               {isOpen
                   ? <TimerForm onClickCancel={handleOnClickCancel} onFormSubmit={handleTimerSubmit}/>
                   : <div className='ui basic content center aligned segment'><button className='ui basic button icon' onClick={() => this.setState({ isOpen: true })}><i className='plus icon'/></button></div>
               }
           </div>
        )
    }
}
class TimersDashboard extends React.Component {
    state = {
        timers: []
    }
    componentDidMount() {
      this.loadTimersFromServer();
      setInterval(this.loadTimersFromServer, 5000);
    }
  loadTimersFromServer() {
    client.getTimers((timers) => this.setState({ timers }));
  }

    render() {
        const { timers } = this.state;
        const onStartTimer = timerId => this.setState({ timers: timers.map(timer => timer.id === timerId ? Object.assign({}, timer, { runningSince: Date.now(), timerIsRunning: true }) : timer) });
        const onStopTimer = timerId => this.setState({ timers: timers.map(timer => timer.id === timerId ? Object.assign({}, timer, { elapsed: Date.now() - timer.runningSince, runningSince: null, timerIsRunning: false }) : timer) });
        const onFormSubmit = (timerState, id) => {
            const { title, project } = timerState;
            if (id) {
              this.setState({ timers: timers.map(timer => timer.id === id ? Object.assign({}, timer, { title, project }) : timer)})
            } else {
              const newTimer = helpers.newTimer(timerState);
              this.setState({ timers: timers.concat(newTimer)});
            }
        }
        const onDeleteTimer = id => this.setState({ timers: timers.filter(timer => timer.id !== id )});          
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={timers} onFormSubmit={onFormSubmit} onDeleteTimer={onDeleteTimer} onStartTimer={onStartTimer} onStopTimer={onStopTimer}/>
                    <ToggleableTimerForm onFormSubmit={onFormSubmit}/>
                </div>
            </div>
        )
    }
}
class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }
    render() {
        const { id, onClickCancel, onFormSubmit } = this.props;
        const { title, project } = this.state;
        const submitText = id ? 'Update': 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' value ={title} onChange={event => this.setState({ title: event.target.value })}/>
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' value ={project} onChange={event => this.setState({ project: event.target.value })}/>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={() => onFormSubmit(this.state, id)}>
                                {submitText}
                            </button>
                            <button className='ui basic blue button' onClick={onClickCancel}>
                                 Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class Timer extends React.Component {

    componentDidMount() {
      this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }
    componentWillUnmount() {
      clearInterval(this.forceUpdateInterval);
    }
    render() {
      const { title, project, elapsed, runningSince, id, onClickEdit, onDeleteTimer, onStartTimer, onStopTimer, timerIsRunning } = this.props;
      return (
        <div className='ui centered card'>
          <div className='content'>
            <div className='header'>
              {title}
            </div>
            <div className='meta'>
              {project}
            </div>
            <div className='center aligned description'>
              <h2>
                {helpers.renderElapsedString(elapsed, runningSince)}
              </h2>
            </div>
            <div className='extra content'>
              <span className='right floated edit icon'>
                <i className='edit icon' onClick={onClickEdit}/>
              </span>
              <span className='right floated trash icon'>
                <i className='trash icon' onClick={() => onDeleteTimer(id)}/>
              </span>
            </div>
          </div>
          {timerIsRunning
            ? <div className='ui bottom attached red basic button' onClick={() => onStartTimer(id)}>Stop</div> 
            : <div className='ui bottom attached blue basic button' onClick={() => onStopTimer(id)}>Start</div>
          }
          </div>
      );
    }
  }

  ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
  );
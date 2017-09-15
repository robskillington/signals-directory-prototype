import React, { Component } from 'react';
import './App.css';
import Autocomplete from 'react-autocomplete';
import {Line} from 'react-chartjs-2';

let app;

class Signal extends Component {
  render() {
    return (
      <li className="App-signal">
        <span className="glyphicon glyphicon-signal" aria-hidden="true"></span>
        <span className="App-signal-slug">
          {this.props.slug}
        </span>
        <span className="App-signal-description">
          {this.props.description}
        </span>
        {this.props.pivots && this.props.pivots.length > 0 &&
          <span className="App-signal-pivots">
            Pivots {this.props.pivots.map((p) => {
              return (
                <span className="label label-default">{p.title}</span>
              );
            })}
          </span>
        }
        {this.props.labels && this.props.labels.length > 0 &&
          <span className="App-signal-labels">
            Labels {this.props.labels.map((t) => {
              return (
                <span className="label label-default">{t.slug}</span>
              );
            })}
          </span>
        }
      </li>
    );
  }
}

class Signals extends Component {
  render() {
    let signals = this.props.signals;
    let elems = signals.map((sig) => {
      return (
        <Signal {...sig} />
      );
    });
    return (
      <ul className="App-signals">
        {elems}
      </ul>
    );
  }
}

class Category extends Component {
  render() {
    let pivotFilters = this.props.pivotFilters;
    let labelFilters = this.props.labelFilters;

    let subcategories = (this.props.subcategories || []).filter((cat) => {
      return categoryFilter(cat, pivotFilters, labelFilters);
    });
    if (subcategories.length > 0) {
      subcategories = (
        <span className="App-category-subcategories">
          <Categories categories={subcategories} pivotFilters={pivotFilters} labelFilters={labelFilters} />
        </span>
      );
    }

    let signals = (this.props.signals || []).filter((sig) => {
      return signalFilter(sig, pivotFilters, labelFilters);
    });
    if (signals.length > 0) {
      signals = (
        <span className="App-category-signals">
          <Signals signals={signals} />
        </span>
      );
    }

    let dropdownId = 'dropdown-category-'+this.props.id;
    return (
      <li className="App-category">
        <span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
        <span className="App-category-description">

          <span className="App-category-title">
            {this.props.title || 'Untitled'}
          </span>

          <div className="dropdown btn-group-xs App-category-actions">

            <button className="btn btn-primary dropdown-toggle" type="button" id={dropdownId} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span className="caret" />
            </button>
            <ul className="dropdown-menu" aria-labelledby={dropdownId}>
              <li><a href="#">Add subcategory</a></li>
              <li><a href="#">Add signal</a></li>
            </ul>
          </div>

        </span>
        {subcategories}
        {signals}
      </li>
    );
  }
}

function signalFilter(signal, pivotFilters, labelFilters) {
  if (pivotFilters.length === 0 && labelFilters.length === 0) {
    return true;
  }
  let matchPivotFilters = pivotFilters.filter((filter) => {
    return signal.pivots.filter((pivot) => {
      return pivot.id == filter.id;
    }).length > 0;
  }).length === pivotFilters.length;
  let matchLabelFilters = labelFilters.filter((filter) => {
    return signal.labels.filter((label) => {
      return label.id == filter.id;
    }).length > 0;
  }).length === labelFilters.length;
  return matchPivotFilters && matchLabelFilters;
}

function categoryFilter(category, pivotFilters, labelFilters) {
  if (pivotFilters.length === 0 && labelFilters.length === 0) {
    return true;
  }
  if ((category.signals || []).filter((signal) => {
    return signalFilter(signal, pivotFilters, labelFilters);
  }).length > 0) {
    return true;
  }
  return (category.subcategories || []).filter((cat) => {
    return categoryFilter(cat, pivotFilters, labelFilters);
  }).length > 0;
}

class Categories extends Component {
  render() {
    let categories = this.props.categories;
    let pivotFilters = this.props.pivotFilters;
    let labelFilters = this.props.labelFilters;
    let elems = categories.filter((cat) => {
      return categoryFilter(cat, pivotFilters, labelFilters);
    }).map((cat) => {
      return (
        <Category pivotFilters={pivotFilters} labelFilters={labelFilters} {...cat} />
      );
    });
    return (
      <ul className="App-categories">
        {elems}
      </ul>
    );
  }
}

class PivotFilter extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    let state = app.state;
    state.pivots.forEach((pivot) => {
      if (pivot.id == this.props.pivot.id) {
        pivot.filtering = !pivot.filtering;
      }
    });
    app.setState(state);
  }

  render() {
    let pivot = this.props.pivot;
    let filterId = 'pivot-filter-' + pivot.id;
    return (
      <div className="input-group">
        <span className="input-group-addon">
          {pivot.filtering ? (
            <input type="checkbox" aria-label={filterId} value={pivot.id} onClick={this.handleSelect} checked />
          ) : (
            <input type="checkbox" aria-label={filterId} value={pivot.id} onClick={this.handleSelect} />
          )}
        </span>
        <input type="text" className="form-control" aria-label={filterId} value={pivot.title} disabled />
      </div>
    );
  }
}

class LabelFilter extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    let state = app.state;
    state.labels.forEach((label) => {
      if (label.id == this.props.label.id) {
        label.filtering = !label.filtering;
      }
    });
    app.setState(state);
  }

  render() {
    let label = this.props.label;
    let filterId = 'label-filter-' + label.id;
    return (
      <div className="input-group">
        <span className="input-group-addon">
          {label.filtering ? (
            <input type="checkbox" aria-label={filterId} value={label.id} onClick={this.handleSelect} checked />
          ) : (
            <input type="checkbox" aria-label={filterId} value={label.id} onClick={this.handleSelect} />
          )}
        </span>
        <input type="text" className="form-control" aria-label={filterId} value={label.slug} disabled />
      </div>
    );
  }
}

class SignalsFilter extends Component {
  render() {
    let pivots = this.props.pivots;
    let pivotsOpts = pivots.map((pivot) => {
      return (
        <PivotFilter pivot={pivot} />
      );
    });
    let labels = this.props.labels;
    let labelsOpts = labels.map((label) => {
      return (
        <LabelFilter label={label} />
      );
    });
    return (
      <div className="App-filter">
        <h4>Signals with pivots</h4>
        {pivotsOpts}
        <h4>Signals with directory labels</h4>
        {labelsOpts}
      </div>
    );
  }
}

class Graph extends Component {
  render() {
    let colors = [
      [255, 174, 185],
      [153, 50,  204],
      [0, 0, 255],
      [99,  184, 255],
      [0, 206, 209],
      [0, 199, 140],
      [192, 255, 62],
      [255, 255, 0],
      [255, 193, 37],
      [139, 69,  0],
      [238, 44,  44],
      [173, 173, 173],
    ];

    let data = {
      labels: this.props.labels,
      datasets: []
    };

    let i = 0;
    (this.props.series || []).forEach((s) => {
      let c = colors[i%colors.length];
      data.datasets.push({
        label: 'ts' + i,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba('+c[0]+','+c[1]+','+c[2]+',0.4)',
        borderColor: 'rgba('+c[0]+','+c[1]+','+c[2]+',1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba('+c[0]+','+c[1]+','+c[2]+',1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba('+c[0]+','+c[1]+','+c[2]+',1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: s.datapoints
      });
      i++;
    });

    return (
      <Line data={data} />
    );
  }
}

class Drilldown extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  render() {
    let items = (this.props.signals || []).map((signal) => {
      return {
        id: signal.id,
        label: signal.id + ': ' + signal.description
      };
    });
    let pivotDrilldowns = [];
    if (this.state.value !== '') {
      let id = this.state.value.split(':')[0];
      let match = (this.props.signals || []).filter((signal) => {
        return signal.id === id;
      });
      if (match.length === 1) {
        let signal = match[0];
        pivotDrilldowns = signal.pivots.map((pivot) => {
          return (
            <div className="App-drilldown-segment input-group input-group-lg">
              <span className="input-group-addon">Filter by {pivot.title}</span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Drilldown by value..." 
                onChange={() => { this.setState(this.state); }} />
            </div>
          );
        });
      }
    }
    let labels = [];
    let series = [];
    let numSeries = 5;
    let numPoints = 20;
    for (let i = 0; i < numPoints; i++) {
      labels.push(i);
    }
    for (let i = 0; i < numSeries; i++) {
      let datapoints = [];
      for (let j = 0; j < numPoints; j++) {
        datapoints.push(Math.floor(Math.random() * 100));
      }
      series.push({datapoints: datapoints});
    }
    let graph = [];
    if (this.state.value && this.state.value !== '') {
      graph.push((
        <Graph labels={labels} series={series} />
      ));
    }
    return (
      <div className="App-drilldown-controls row">
        <div className="col-lg-3">
        <div className="App-drilldown-segment input-group input-group-lg">
          <span className="input-group-addon">Signal</span>
          <Autocomplete
            items={items}
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={item => item.label}
            renderItem={(item, highlighted) =>
              <div
                key={item.id}
                style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
              >
                {item.label}
              </div>
            }
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={value => this.setState({ value })}
          />
        </div>
        {pivotDrilldowns}
        </div>
        <div className="App-drilldown-graph col-lg-7">
          <div className="jumbotron">
            {graph}
          </div>
        </div>
      </div>
    );
  }
}

const ViewDirectory = 'directory';
const ViewDrilldown = 'drilldown';

function categorySignals(category) {
  let signals = category.signals || [];
  (category.subcategories || []).forEach((sub) => {
    categorySignals(sub).forEach((sig) => {
      signals.push(sig);
    });
  });
  return signals;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleViewDirectory = this.handleViewDirectory.bind(this);
    this.handleViewDrilldown = this.handleViewDrilldown.bind(this);
    let pivots = [
      {
        id: 'city',
        title: 'city',
        values: ['San Francisco', 'New York', 'Seattle'],
        filtering: false
      },
      {
        id: 'product_type',
        title: 'product_type',
        values: ['Ridesharing', 'Eats'],
        filtering: false
      },
      {
        id: 'status_code',
        title: 'status_code',
        values: ['2xx', '3xx', '4xx', '5xx'],
        filtering: false
      },
      {
        id: 'caller',
        title: 'caller',
        values: ['rt-demand', 'geobase'],
        filtering: false
      },
      {
        id: 'callee',
        title: 'callee',
        values: ['rt-demand', 'geobase'],
        filtering: false
      },
      {
        id: 'host',
        title: 'host',
        values: [],
        filtering: false
      },
      {
        id: 'container_instance',
        title: 'container_instance',
        values: [],
        filtering: false
      }
    ];
    let labels = [
      {
        id: 'marketplace_health',
        slug: 'marketplace_health',
        filtering: false
      },
      {
        id: 'container_level_stats',
        slug: 'container_level_stats',
        filtering: false
      },
      {
        id: 'host_level_stats',
        slug: 'host_level_stats',
        filtering: false
      }
    ];
    this.state = {
      view: ViewDirectory,
      categories: [
        {
          id: 'services',
          title: 'Services',
          subcategories: [
            {
              id: 'rt-demand',
              title: 'rt-demand',
              signals: [
                {
                  id: 'jobs_dispatching',
                  slug: 'jobs_dispatching',
                  description: 'Current jobs being dispatched that have not been accepted',
                  pivots: pivots.filter((p) => {
                    return ['city', 'product_type'].indexOf(p.id) !== -1;
                  }),
                  labels: []
                },
                {
                  id: 'jobs_completed',
                  slug: 'jobs_completed',
                  description: 'Jobs ended per second',
                  pivots: pivots.filter((p) => {
                    return ['city', 'product_type'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['marketplace_health'].indexOf(t.id) !== -1;
                  })
                }
              ]
            },
            {
              id: 'geobase',
              title: 'geobase',
              signals: [
                {
                  id: 'nearest_supply_queries',
                  slug: 'nearest_supply_queries',
                  description: 'Queries for nearest supply based on criteria',
                  pivots: pivots.filter((p) => {
                    return ['city','status_code'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['marketplace_health'].indexOf(t.id) !== -1;
                  })
                }
              ]
            }
          ],
        },
        {
          id: 'infrastructure',
          title: 'Infrastructure',
          subcategories: [
            {
              id: 'muttley',
              title: 'Muttley',
              signals: [
                {
                  id: 'rpc_request',
                  slug: 'rpc_request',
                  description: 'RPC requests made',
                  pivots: pivots.filter((p) => {
                    return ['caller', 'callee'].indexOf(p.id) !== -1;
                  }),
                  labels: []
                },
                {
                  id: 'rpc_request_per_host',
                  slug: 'rpc_request_per_host',
                  description: 'RPC requests made per host',
                  pivots: pivots.filter((p) => {
                    return ['host', 'caller', 'callee'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['host_level_stats'].indexOf(t.id) !== -1;
                  })
                }
              ]
            },
            {
              id: 'compute',
              title: 'Compute',
              signals: [
                {
                  id: 'compute_cpu_load_avg',
                  slug: 'compute_cpu_load_avg',
                  description: 'CPU load average',
                  pivots: pivots.filter((p) => {
                    return ['container_instance'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['container_level_stats'].indexOf(t.id) !== -1;
                  })
                },
                {
                  id: 'compute_memory_app_utilization',
                  slug: 'compute_memory_app_utilization',
                  description: 'Memory utilization by container application',
                  pivots: pivots.filter((p) => {
                    return ['container_instance'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['container_level_stats'].indexOf(t.id) !== -1;
                  })
                }
              ]
            },
            {
              id: 'ubermon',
              title: 'Ubermon',
              signals: [
                {
                  id: 'cpu_load_avg',
                  slug: 'cpu_load_avg',
                  description: 'CPU load average',
                  pivots: pivots.filter((p) => {
                    return ['host'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['host_level_stats'].indexOf(t.id) !== -1;
                  })
                },
                {
                  id: 'memory_app_utilization',
                  slug: 'memory_app_utilization',
                  description: 'Memory utilization by applications',
                  pivots: pivots.filter((p) => {
                    return ['host'].indexOf(p.id) !== -1;
                  }),
                  labels: labels.filter((t) => {
                    return ['host_level_stats'].indexOf(t.id) !== -1;
                  })
                }
              ]
            }
          ]
        }
      ],
      pivots: pivots,
      labels: labels
    };
  }

  componentDidMount() {
    app = this;
  }

  handleViewDirectory() {
    let state = app.state;
    state.view = ViewDirectory;
    app.setState(state);
  }

  handleViewDrilldown() {
    let state = app.state;
    state.view = ViewDrilldown;
    app.setState(state);
  }

  renderViewDirectory() {
    let pivotFilters = this.state.pivots.filter((p) => {
      return p.filtering;
    });
    let labelFilters = this.state.labels.filter((t) => {
      return t.filtering;
    });
    return (
      <div className="App-content-container">
        <div className="App-content-filter">
          <h3>Filter</h3>
          <SignalsFilter pivots={this.state.pivots} labels={this.state.labels} />
        </div>
        <div className="App-content-directory">
          <h3>Categories</h3>
          <Categories categories={this.state.categories} pivotFilters={pivotFilters} labelFilters={labelFilters} />
        </div>
      </div>
    );
  }

  renderViewDrilldown() {
    let signals = [];
    (this.state.categories || []).forEach((cat) => {
      categorySignals(cat).forEach((sig) => {
        signals.push(sig);
      });
    });
    return (
      <div className="App-content-container">
        <div className="App-content-drilldown">
          <h3>Drilldown</h3>
          <Drilldown signals={signals} />
        </div>
      </div>
    );
  }

  render() {
    let directoryNav = this.state.view === ViewDirectory ? (
      <li role="presentation" className="active">
        <a href="#" onClick={this.handleViewDirectory}>Directory</a>
      </li>
    ) : (
      <li role="presentation">
        <a href="#" onClick={this.handleViewDirectory}>Directory</a>
      </li>
    );
    let drilldownNav = this.state.view === ViewDrilldown ? (
      <li role="presentation" className="active">
        <a href="#" onClick={this.handleViewDrilldown}>Drilldown</a>
      </li>
    ) : (
      <li role="presentation">
        <a href="#" onClick={this.handleViewDrilldown}>Drilldown</a>
      </li>
    );
    return (
      <div className="App">
        <div className="App-header">
          <h2>Signals Directory</h2>
          <ul className="nav nav-pills">
            {directoryNav}
            {drilldownNav}
          </ul>
        </div>
        {this.state.view === ViewDirectory ? this.renderViewDirectory() : this.renderViewDrilldown()}
      </div>
    );
  }
}

export default App;

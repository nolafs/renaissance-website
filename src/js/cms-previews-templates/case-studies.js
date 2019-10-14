import React from "react";


export default class CaseStudies extends React.Component {

    render() {
        const {entry, getAsset, widgetFor} = this.props;
        let image = getAsset(entry.getIn(["data", "image"]));
        return <div>
            <div className="grid-container full" id="root">

                <div className="grid-container full block header single">
                    <div className="grid-container">
                        <div className="grid-x grid-padding-x grid-margin-y align-middle">
                            <div className="cell small-12 medium-8">
                                <img src="{ image }" alt="Synced: Off Planet" />
                            </div>
                            <div className="cell small-12 medium-4 align-self-center f-c-black single-header">
                                <h2><small>entry.getIn(["data", "heading"])</small>{entry.getIn(["data", "categories"])}</h2>
                                <p>{entry.getIn(["data", "client"])}</p>

                            </div>
                        </div>
                        <div className="lightning">
                            <img src="/images/lightning-section.png" />
                        </div>
                    </div>
                </div>
            <div className="grid-container single-article">
                <div className="grid-x grid-padding-x">
                    <div className="cell small-12 medium-8">
                     <article>
                        { widgetFor("body") }
                    </article>
                    </div>
                    <div className="cell small-12 medium-4">
                        aside
                    </div>
                </div>
            </div>
        </div>
        </div>;

    }
}
